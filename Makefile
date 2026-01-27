# GoPulse Makefile
# Configuration
BINARY_NAME=monitor-app
CONFIG_FILE=config.json
LOG_FILE=monitoring.log

# Default target
.DEFAULT_GOAL := help

.PHONY: help up down logs db-init agent-build agent-run clean

## -- APP STACK (Docker) --

## Démarrer toute la solution (Dashboard + Agent + DB)
up:
	@echo "🚀 Démarrage de la stack GoPulse..."
	docker compose up --build -d
	@echo "✅ Dashboard accessible sur http://localhost:3000"

## Arrêter toute la solution
down:
	@echo "🛑 Arrêt de la stack..."
	docker compose down

## Voir les journaux (logs) en temps réel
logs:
	docker compose logs -f

## Initialiser ou mettre à jour la base de données
db-init:
	@echo "📦 Initialisation de la base de données..."
	docker compose exec web npx prisma@5 db push

## -- AGENT LOCAL (Go) --

## Compiler l'agent de monitoring uniquement
agent-build:
	@echo "🔨 Compilation de l'agent..."
	go build -o $(BINARY_NAME)
	@echo "✅ Terminé : ./$(BINARY_NAME)"

## Lancer l'agent de monitoring localement
agent-run: agent-build
	@echo "📡 Lancement de l'agent..."
	./$(BINARY_NAME) $(CONFIG_FILE)

## -- UTILS --

## Nettoyer le projet (supprimer binaire et logs)
clean:
	@echo "🧹 Nettoyage..."
	rm -f $(BINARY_NAME)
	rm -f $(LOG_FILE)
	@echo "✨ Projet propre."

## Afficher cette aide
help:
	@echo "-----------------------------------------------------------------------"
	@echo "                     🌐 GOPULSE - COMMAND CENTER"
	@echo "-----------------------------------------------------------------------"
	@echo ""
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  \033[36m%-20s\033[0m %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "-----------------------------------------------------------------------"
