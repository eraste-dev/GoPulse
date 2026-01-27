# Nom du binaire
BINARY_NAME=monitor-app
# Fichier de config
CONFIG_FILE=config.json
# Fichier de log
LOG_FILE=monitoring.log

.PHONY: all build run clean help

all: build

## Compilier l'application
build:
	@echo "Construction du binaire..."
	go build -o $(BINARY_NAME)
	@echo "Construction terminée : ./$(BINARY_NAME)"

## Lancer l'application
run: build
	@echo "Lancement de l'application..."
	./$(BINARY_NAME) $(CONFIG_FILE)

## Lancer l'application en arrière-plan (nohup)
start-background: build
	@echo "Lancement en arrière-plan..."
	nohup ./$(BINARY_NAME) $(CONFIG_FILE) > /dev/null 2>&1 &
	@echo "Application lancée. PID :"
	@pgrep -f $(BINARY_NAME)

## Arrêter l'application (kill)
stop:
	@echo "Arrêt de l'application..."
	pkill -f $(BINARY_NAME) || echo "Application non trouvée"

## Nettoyer les fichiers générés (binaire et logs)
clean:
	@echo "Nettoyage..."
	rm -f $(BINARY_NAME)
	rm -f $(LOG_FILE)
	@echo "Nettoyage terminé."

## Afficher l'aide
help:
	@echo "Commandes disponibles :"
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  \033[36m%-20s\033[0m %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
