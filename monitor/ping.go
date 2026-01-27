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

// CheckSite effectue une requête HTTP GET vers l'URL cible
func CheckSite(url string, timeoutSeconds int) *PingResult {
	client := http.Client{
		Timeout: time.Duration(timeoutSeconds) * time.Second,
	}

	start := time.Now()
	resp, err := client.Get(url)
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
	if resp.StatusCode == http.StatusOK {
		result.Success = true
	} else {
		result.Success = false
		result.ErrorMessage = fmt.Sprintf("Code de statut inattendu : %d", resp.StatusCode)
	}

	return result
}
