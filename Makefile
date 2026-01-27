# GoPulse Makefile
include .env
export $(shell sed 's/=.*//' .env)

# Configuration
BINARY_NAME=monitor-app
CONFIG_FILE=config.json
LOG_FILE=monitoring.log

# Selection du fichier Docker Compose en fonction de APP_ENV
COMPOSE_FILE=docker/docker-compose.yml
ifeq ($(APP_ENV),dev)
	COMPOSE_FILE=docker/docker-compose.dev.yml
endif

.DEFAULT_GOAL := help

.PHONY: help start stop logs agent clean db-init

## -- COMMANDES PRINCIPALES --

## Démarrer l'application (en fonction de APP_ENV)
start:
	@echo "🚀 Démarrage de GoPulse en mode [$(APP_ENV)]..."
	docker compose -f $(COMPOSE_FILE) up --build -d
	@echo "✅ Application accessible sur http://localhost:$(WEB_PORT)"

## Arrêter l'application
stop:
	@echo "🛑 Arrêt de l'application..."
	docker compose -f $(COMPOSE_FILE) down

## Voir les journaux (logs)
logs:
	docker compose -f $(COMPOSE_FILE) logs -f

## Lancer l'agent de monitoring local (Go)
agent:
	@echo "📡 Lancement de l'agent local..."
	@go build -o $(BINARY_NAME)
	@./$(BINARY_NAME) $(CONFIG_FILE)

## -- UTILS --

## Nettoyer le projet (supprimer binaire et logs)
clean:
	@echo "🧹 Nettoyage..."
	rm -f $(BINARY_NAME)
	rm -f $(LOG_FILE)
	@echo "✨ Projet propre."

# Initialise la DB (Prisma Push)
db-init:
	@echo "📦 Initialisation de la base de données..."
	docker compose -f $(COMPOSE_FILE) exec api npx prisma db push

# Seed la DB (Données de test)
seed:
	@echo "🌱 Remplissage de la base de données..."
	docker compose -f $(COMPOSE_FILE) exec api npx prisma db seed

# Nettoyer tout (Volumes inclus)
clean:
	@echo "🧹 Nettoyage..."
	rm -f $(BINARY_NAME)
	rm -f $(LOG_FILE)
	docker compose -f $(COMPOSE_FILE) down -v
	@echo "✨ Projet propre."

## Afficher cette aide
help:
	@echo "-----------------------------------------------------------------------"
	@echo "                     🌐 GOPULSE - MONITORING"
	@echo "-----------------------------------------------------------------------"
	@echo " Mode actuel : \033[32m$(APP_ENV)\033[0m (Port Web: $(WEB_PORT), Port DB: $(DB_PORT))"
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
