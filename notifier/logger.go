package notifier

import (
	"log"
	"os"
)

// LogToFile ouvre le fichier de log et écrit le message
func LogToFile(filePath string, message string) error {
	// Ouvre le fichier en append mode, ou le crée s'il n'existe pas
	f, err := os.OpenFile(filePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	if _, err := f.WriteString(message + "\n"); err != nil {
		return err
	}
	return nil
}

// SetupLogger configure le logger global pour afficher aussi dans la console
func SetupLogger() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}
