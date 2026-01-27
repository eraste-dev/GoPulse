# Monitor App (Ping Website)

Application autonome de surveillance de site web écrite en Go.

## Fonctionnalités
- Vérifie l'accessibilité d'une URL configurée à intervalle régulier via un simple Ping HTTP.
- Envoie une alerte par Email en cas d'échec (timeout, erreur 404/500, erreur DNS).
- Logue toutes les tentatives (succès et échecs) dans un fichier `monitoring.log` local.
- Fonctionne avec un simple exécutable binaire et un fichier de configuration JSON.

## Prérequis
Aucun ! L'application est un binaire autonome.

## Configuration
Editez le fichier `config.json` :

```json
{
  "target_url": "https://google.com",
  "check_interval_seconds": 300,
  "request_timeout_seconds": 10,
  "log_file_path": "./monitoring.log",
  "email_config": {
    "enabled": true,
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "sender_email": "votre@email.com",
    "sender_password": "votre_mot_de_passe_app",
    "recipient_email": "admin@email.com"
  }
}
```

## Compilation (si modification du code source)
Pour recompiler l'application depuis les sources :
```bash
go build -o monitor-app
```

## Utilisation avec Makefile (Recommandé)
Pour simplifier les opérations courantes, utilisez les commandes `make` :

```bash
make build              # Compile l'application
make run                # Compile et lance l'application
make start-background   # Lance l'application en arrière-plan (nohup)
make stop               # Arrête l'application en cours d'exécution
make clean              # Supprime le binaire et les logs
make help               # Affiche cette aide
```

## Déploiement en arrière-plan (Linux)
Pour que l'application tourne en permanence, vous pouvez utiliser `nohup` ou créer un service `systemd`.

### Via nohup (rapide)
```bash
nohup ./monitor-app > app.log 2>&1 &
```

### Via Systemd (recommandé)
Créez un fichier `/etc/systemd/system/ping-monitor.service` :
```ini
[Unit]
Description=Ping Website Monitor
After=network.target

[Service]
ExecStart=/chemin/vers/monitor-app /chemin/vers/config.json
Restart=always
User=votre_user

[Install]
WantedBy=multi-user.target
```
Puis activez le service :
```bash
sudo systemctl enable ping-monitor
sudo systemctl start ping-monitor
```
