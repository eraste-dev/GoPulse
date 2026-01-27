# Package Notifier

Ce package gère l'ensemble des alertes et du reporting de l'agent.

## Modules
- `logger.go` : Enregistre les activités dans un fichier log local (`monitoring.log`).
- `mail.go` : Gère l'envoi d'emails d'alerte via SMTP en cas d'échec de ping.
- `webhook.go` : Envoie les rapports JSON vers l'application de Dashboard (Phase 2).

## Flux de données
1. L'agent reçoit le résultat du ping.
2. Le `logger` écrit toujours le résultat.
3. Si échec, le `mail` envoie une alerte.
4. Si activé, le `webhook` envoie le JSON au Dashboard.
