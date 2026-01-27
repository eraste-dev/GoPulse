package notifier

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"ping_website/monitor"
)

// WebhookConfig contains settings for sending data to a remote server
type WebhookConfig struct {
	Enabled       bool   `json:"enabled"`
	URL           string `json:"url"`
	AuthToken     string `json:"auth_token"`     // Optional bearer token
	ReportSuccess bool   `json:"report_success"` // If false, only report failures
}

// WebhookPayload represents the data sent to the remote monitoring app
type WebhookPayload struct {
	TargetURL    string  `json:"target_url"`
	Status       string  `json:"status"` // "UP" or "DOWN"
	StatusCode   int     `json:"status_code"`
	ResponseTime float64 `json:"response_time_ms"`
	Timestamp    string  `json:"timestamp"`
	ErrorMessage string  `json:"error_message,omitempty"`
	AgentID      string  `json:"agent_id"` // Configured identifier if multiple agents
}

// SendWebhook sends the ping result to the configured webhook URL
func SendWebhook(config WebhookConfig, targetURL string, result *monitor.PingResult) error {
	if !config.Enabled {
		return nil
	}

	// Optimization: If we only want to report failures and it was a success, skip it.
	if !config.ReportSuccess && result.Success {
		return nil
	}

	payload := WebhookPayload{
		TargetURL:    targetURL,
		Status:       "DOWN",
		StatusCode:   result.StatusCode,
		ResponseTime: float64(result.Duration.Milliseconds()),
		Timestamp:    result.Timestamp.Format(time.RFC3339),
		ErrorMessage: result.ErrorMessage,
		AgentID:      "ping-agent-01", // Hardcoded for now, could be in config
	}

	if result.Success {
		payload.Status = "UP"
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal webhook payload: %w", err)
	}

	client := &http.Client{
		Timeout: 5 * time.Second, // Don't block the main loop for too long
	}

	req, err := http.NewRequest("POST", config.URL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create webhook request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if config.AuthToken != "" {
		req.Header.Set("Authorization", "Bearer "+config.AuthToken)
	}
	req.Header.Set("User-Agent", "PingWebsite-Agent/1.0")

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send webhook: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("webhook server returned error status: %d", resp.StatusCode)
	}

	return nil
}
