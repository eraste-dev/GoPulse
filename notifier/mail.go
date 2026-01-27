package notifier

import (
	"fmt"
	"net/smtp"

	"time"
)

// EmailConfig contient la configuration SMTP
type EmailConfig struct {
	Enabled       bool   `json:"enabled"`
	SMTPServer    string `json:"smtp_server"`
	SMTPPort      int    `json:"smtp_port"`
	SenderEmail   string `json:"sender_email"`
	SenderPass    string `json:"sender_password"`
	RecipientMail string `json:"recipient_email"`
}

// SendAlert envoie un email d'alerte en cas de problème
func SendAlert(config EmailConfig, subject string, body string) error {
	if !config.Enabled {
		return nil
	}

	auth := smtp.PlainAuth("", config.SenderEmail, config.SenderPass, config.SMTPServer)

	msg := []byte("To: " + config.RecipientMail + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Content-Type: text/plain; charset=UTF-8\r\n" +
		"\r\n" +
		"Ping Website Alert - " + time.Now().Format("2006-01-02 15:04:05") + "\n\n" +
		body + "\r\n")

	addr := fmt.Sprintf("%s:%d", config.SMTPServer, config.SMTPPort)

	// Envoi de l'email
	err := smtp.SendMail(addr, auth, config.SenderEmail, []string{config.RecipientMail}, msg)
	if err != nil {
		return fmt.Errorf("erreur lors de l'envoi de l'email: %w", err)
	}

	return nil
}
