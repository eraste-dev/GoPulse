package monitor

import (
	"fmt"
	"net/http"
	"time"
)

// PingResult structure pour contenir le résultat de la vérification
type PingResult struct {
	Success      bool
	StatusCode   int
	Duration     time.Duration
	ErrorMessage string
	Timestamp    time.Time
}

// RequestConfig définit les paramètres de la requête de monitoring
type RequestConfig struct {
	URL            string
	Method         string
	TimeoutSeconds int
	Headers        map[string]string
	UserAgent      string
	ExpectedStatus int
}

// CheckSite effectue une requête HTTP vers l'URL cible avec configuration avancée
func CheckSite(config RequestConfig) *PingResult {
	if config.Method == "" {
		config.Method = "GET"
	}
	if config.ExpectedStatus == 0 {
		config.ExpectedStatus = 200
	}

	client := http.Client{
		Timeout: time.Duration(config.TimeoutSeconds) * time.Second,
	}

	req, err := http.NewRequest(config.Method, config.URL, nil)
	if err != nil {
		return &PingResult{
			Success:      false,
			ErrorMessage: fmt.Sprintf("Erreur lors de la création de la requête : %v", err),
			Timestamp:    time.Now(),
		}
	}

	// Appliquer les headers
	for k, v := range config.Headers {
		req.Header.Set(k, v)
	}
	if config.UserAgent != "" {
		req.Header.Set("User-Agent", config.UserAgent)
	}

	start := time.Now()
	resp, err := client.Do(req)
	duration := time.Since(start)

	result := &PingResult{
		Timestamp: start,
		Duration:  duration,
	}

	if err != nil {
		result.Success = false
		result.ErrorMessage = fmt.Sprintf("Erreur de connexion : %v", err)
		return result
	}
	defer resp.Body.Close()

	result.StatusCode = resp.StatusCode
	if resp.StatusCode == config.ExpectedStatus {
		result.Success = true
	} else {
		result.Success = false
		result.ErrorMessage = fmt.Sprintf("Code de statut inattendu : %d (Attendu : %d)", resp.StatusCode, config.ExpectedStatus)
	}

	return result
}
