package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"ping_website/monitor"
	"ping_website/notifier"
)

// GlobalConfig holds agent-wide settings
type GlobalConfig struct {
	Region         string
	DashboardURL   string
	UpdateInterval time.Duration
	LogFilePath    string
	WebhookURL     string
}

// MonitorInfo represents a monitor task fetched from the API
type MonitorInfo struct {
	ID             string            `json:"id"`
	URL            string            `json:"url"`
	Method         string            `json:"method"`
	Interval       int               `json:"interval"`
	Timeout        int               `json:"timeout"`
	Threshold      int               `json:"threshold"`
	Headers        map[string]string `json:"headers"`
	UserAgent      string            `json:"userAgent"`
	ExpectedStatus int               `json:"expectedStatus"`
}

var (
	monitorsMap = make(map[string]*MonitorTask)
	mapMutex    sync.Mutex
	globalConf  GlobalConfig
)

type MonitorTask struct {
	Info     MonitorInfo
	StopChan chan bool
}

func main() {
	notifier.SetupLogger()

	// Configuration via variables d'environnement
	globalConf = GlobalConfig{
		Region:         getEnv("AGENT_REGION", "europe"),
		DashboardURL:   getEnv("DASHBOARD_URL", "http://web:3000"),
		UpdateInterval: 1 * time.Minute,
		LogFilePath:    getEnv("LOG_FILE_PATH", "monitoring.log"),
		WebhookURL:     getEnv("WEBHOOK_URL", "http://web:3000/api/report"),
	}

	log.Printf("🚀 Démarrage de l'agent GoPulse (Région: %s)", globalConf.Region)

	// Boucle de synchronisation avec le Dashboard
	syncMonitors()
	ticker := time.NewTicker(globalConf.UpdateInterval)
	for range ticker.C {
		syncMonitors()
	}
}

func syncMonitors() {
	log.Println("🔄 Synchronisation des moniteurs...")

	resp, err := http.Get(fmt.Sprintf("%s/api/agent/work?region=%s", globalConf.DashboardURL, globalConf.Region))
	if err != nil {
		log.Printf("❌ Erreur lors de la récupération du travail: %v", err)
		return
	}
	defer resp.Body.Close()

	var activeMonitors []MonitorInfo
	if err := json.NewDecoder(resp.Body).Decode(&activeMonitors); err != nil {
		log.Printf("❌ Erreur lors du décodage du JSON: %v", err)
		return
	}

	mapMutex.Lock()
	defer mapMutex.Unlock()

	// Garder trace des IDs actifs pour savoir quoi supprimer
	activeIDs := make(map[string]bool)

	for _, info := range activeMonitors {
		activeIDs[info.ID] = true

		if existing, ok := monitorsMap[info.ID]; ok {
			// Si l'intervalle a changé, on redémarre la routine
			if existing.Info.Interval != info.Interval || existing.Info.URL != info.URL {
				log.Printf("♻️ Mise à jour du moniteur: %s", info.URL)
				existing.StopChan <- true
				delete(monitorsMap, info.ID)
				startMonitorRoutine(info)
			}
		} else {
			// Nouveau moniteur
			log.Printf("➕ Nouveau moniteur détecté: %s", info.URL)
			startMonitorRoutine(info)
		}
	}

	// Supprimer les moniteurs qui ne sont plus dans la liste
	for id, task := range monitorsMap {
		if !activeIDs[id] {
			log.Printf("➖ Suppression du moniteur: %s", task.Info.URL)
			task.StopChan <- true
			delete(monitorsMap, id)
		}
	}
}

func startMonitorRoutine(info MonitorInfo) {
	stopChan := make(chan bool)
	task := &MonitorTask{
		Info:     info,
		StopChan: stopChan,
	}
	monitorsMap[info.ID] = task

	go func() {
		ticker := time.NewTicker(time.Duration(info.Interval) * time.Second)
		defer ticker.Stop()

		// Premier check immédiat
		runCheck(info)

		for {
			select {
			case <-ticker.C:
				runCheck(info)
			case <-stopChan:
				return
			}
		}
	}()
}

func runCheck(info MonitorInfo) {
	consecutiveFailures := 0

	for i := 0; i < info.Threshold; i++ {
		result := monitor.CheckSite(monitor.RequestConfig{
			URL:            info.URL,
			Method:         info.Method,
			TimeoutSeconds: info.Timeout,
			Headers:        info.Headers,
			UserAgent:      info.UserAgent,
			ExpectedStatus: info.ExpectedStatus,
		})

		timestamp := result.Timestamp.Format("2006-01-02 15:04:05")

		if result.Success {
			if consecutiveFailures > 0 {
				log.Printf("[%s] 恢复: %s est de nouveau en ligne après %d tentatives", timestamp, info.URL, i+1)
			}
			logMsg := fmt.Sprintf("[%s] SUCCESS: %s - %d - %v", timestamp, info.URL, result.StatusCode, result.Duration)
			notifier.LogToFile(globalConf.LogFilePath, logMsg)

			// Reporting (toujours reporter si c'est un succès direct ou après retry)
			sendReport(info.ID, result)
			return
		}

		consecutiveFailures++
		log.Printf("[%s] ÉCHEC (%d/%d): %s - %s", timestamp, consecutiveFailures, info.Threshold, info.URL, result.ErrorMessage)

		if consecutiveFailures < info.Threshold {
			// Attendre un peu avant de réessayer (ex: 2 secondes)
			time.Sleep(2 * time.Second)
		} else {
			// On a atteint le seuil d'échec
			logMsg := fmt.Sprintf("[%s] FAILURE: %s definitivement DOWN après %d tentatives", timestamp, info.URL, info.Threshold)
			notifier.LogToFile(globalConf.LogFilePath, logMsg)

			// Envoyer le rapport d'échec
			sendReport(info.ID, result)
		}
	}
}

func sendReport(monitorID string, result *monitor.PingResult) {
	conf := notifier.WebhookConfig{
		Enabled:       true,
		URL:           globalConf.WebhookURL,
		ReportSuccess: true, // Pour l'instant on veut voir les courbes
	}

	if err := notifier.SendWebhook(conf, monitorID, globalConf.Region, result); err != nil {
		log.Printf("⚠️ Erreur reporting: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
