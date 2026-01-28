# GoPulse - Monitoring & Dashboard

Solution complète de surveillance de site web, composée de deux parties autonomes mais interconnectées :
1.  **Agent (GoPulse Agent)** : Application Golang ultra-légère qui ping le site et envoie des alertes.
2.  **Dashboard (GoPulse Web)** : Interface Next.js pour visualiser l'historique et les statistiques.

## 🚀 Démarrage Rapide (Docker)

La méthode recommandée pour lancer la stack complète (Dashboard + Agent + Base de données).

```bash
# 1. Configurer l'agent
cp config.json.example config.json
# Editez config.json avec vos paramètres SMTP

# 2. Lancer la stack
make start

# 3. Initialiser la base de données
make db-init
```

Accédez ensuite au Dashboard : **http://localhost:3000**
*   **Login** : `admin@monitor.com`
*   **Password** : `admin`

---

## 🏗️ Architecture

### 1. Agent (Golang)
*   **Rôle** : Surveille l'URL cible, logue localement, envoie des emails d'alerte.
*   **Autonomie** : Peut fonctionner seul sans le dashboard.
*   **Docker** : En mode Docker, il envoie aussi les données au Dashboard via Webhook.

### 2. Dashboard (Next.js 14)
*   **Rôle** : Affiche les graphiques de temps de réponse et l'historique uptime.
*   **Stack** : Next.js, Prisma, PostgreSQL, TailwindCSS, ShadcnUI via Recharts.
*   **Sécurité** : Authentification via NextAuth.

## 🛠️ Commandes Utiles (Makefile)

Tapez simplement `make` à la racine pour voir toutes les options.

### Docker (Stack complète)
*   `make up`      : Lance tout en arrière-plan (Dashboard + Agent + DB).
*   `make logs`    : Affiche les logs de tous les conteneurs.
*   `make down`    : Arrête tous les services.
*   `make db-init` : Initialise le schéma de la base de données.

### Agent Seul (Mode Standalone)
*   `make agent-build` : Compile l'agent localement.
*   `make agent-run`   : Lance l'agent localement sur votre machine.
*   `make clean`       : Supprime les fichiers temporaires.

## 📝 Configuration (config.json)

```json
{
  "target_url": "https://votre-site.com",
  "check_interval_seconds": 60,
  "email_config": {
    "enabled": true,
    "smtp_server": "smtp.gmail.com",
    ...
  },
  "webhook_config": {
    "enabled": true, 
    "url": "http://web:3000/api/report" // URL interne Docker
  }
}
```
*Note : En mode Docker, `WEBHOOK_URL` est automatiquement configuré via variable d'environnement.*
