package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"

	"os"
	"time"

	"ping_website/monitor"
	"ping_website/notifier"
)

// Config structure to hold configuration from JSON file
type Config struct {
	TargetURL      string                 `json:"target_url"`
	CheckInterval  int                    `json:"check_interval_seconds"`
	RequestTimeout int                    `json:"request_timeout_seconds"`
	LogFilePath    string                 `json:"log_file_path"`
	Email          notifier.EmailConfig   `json:"email_config"`
	Webhook        notifier.WebhookConfig `json:"webhook_config"`
}

func loadConfig(path string) (*Config, error) {
	file, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var config Config
	err = json.Unmarshal(file, &config)
	if err != nil {
		return nil, err
	}
	return &config, nil
}

func main() {
	notifier.SetupLogger()

	configPath := "config.json"
	if len(os.Args) > 1 {
		configPath = os.Args[1]
	}

	config, err := loadConfig(configPath)
	if err != nil {
		log.Fatalf("Erreur lors du chargement de la configuration: %v", err)
	}

	// Override Webhook URL from Env (Docker friendly)
	if envWebhook := os.Getenv("WEBHOOK_URL"); envWebhook != "" {
		config.Webhook.URL = envWebhook
		// Auto-enable if env var is present
		config.Webhook.Enabled = true
		log.Printf("Webhook URL override from ENV: %s", config.Webhook.URL)
	}

	log.Printf("Démarrage du monitoring pour : %s (Intervalle: %ds)", config.TargetURL, config.CheckInterval)

	ticker := time.NewTicker(time.Duration(config.CheckInterval) * time.Second)
	defer ticker.Stop()

	// Premier check immédiat
	checkRoutine(config)

	for range ticker.C {
		checkRoutine(config)
	}
}

func checkRoutine(config *Config) {
	result := monitor.CheckSite(config.TargetURL, config.RequestTimeout)
	timestamp := result.Timestamp.Format("2006-01-02 15:04:05")

	if result.Success {
		logMsg := fmt.Sprintf("[%s] SUCCESS: %s - %d - %v", timestamp, config.TargetURL, result.StatusCode, result.Duration)
		log.Println(logMsg)
		// Optionnel: loguer aussi les succès dans le fichier ? Pour l'instant on logue tout.
		notifier.LogToFile(config.LogFilePath, logMsg)
	} else {
		errMsg := result.ErrorMessage
		if result.StatusCode != 0 {
			errMsg = fmt.Sprintf("Code: %d", result.StatusCode)
		}

		logMsg := fmt.Sprintf("[%s] FAILURE: %s - %s", timestamp, config.TargetURL, errMsg)
		log.Println(logMsg)
		notifier.LogToFile(config.LogFilePath, logMsg)

		// Envoyer une alerte par email
		subject := fmt.Sprintf("ALERTE: Site inaccessible - %s", config.TargetURL)
		body := fmt.Sprintf("Le site %s est inaccessible.\n\nErreur : %s\nTemps de réponse : %v\nDate : %s",
			config.TargetURL, errMsg, result.Duration, timestamp)

		if err := notifier.SendAlert(config.Email, subject, body); err != nil {
			log.Printf("Erreur lors de l'envoi de l'alerte email: %v", err)
			notifier.LogToFile(config.LogFilePath, fmt.Sprintf("[%s] EMAIL ERROR: %v", timestamp, err))
		} else {
			log.Println("Alerte email envoyée avec succès.")
		}

	}

	// Reporting via Webhook (pour la Phase 2)
	if err := notifier.SendWebhook(config.Webhook, config.TargetURL, result); err != nil {
		log.Printf("Erreur Webhook: %v", err)
	}
}
