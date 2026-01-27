# Spécifications Techniques - Mini Application de Monitoring Web

## 1. Objectif du Projet
Créer une application légère, autonome et facile à déployer pour surveiller la disponibilité d'un site web. L'application doit fonctionner indépendamment de la technologie du site surveillé (PHP, Python, Node, etc.).

## 2. Choix Technologique
*   **Langage :** Go (Golang).
*   **Raison du choix :** 
    *   Compilation en un **binaire unique** (exécutable) : Aucun besoin d'installer des dépendances (comme Python ou Node.js) sur le serveur cible.
    *   Performance et robustesse pour les tâches réseaux et système.
    *   Multiplateforme (Linux, Windows, MacOS).

## 3. Fonctionnalités Clés

### A. Configuration Externe
Tout doit être configurable sans modifier le code source. Un fichier de configuration (ex: `config.json`) sera utilisé pour définir :
*   **Target** : L'URL du site à surveiller (ex: `https://mon-site.com`).
*   **Intervalle** : Fréquence des vérifications (ex: toutes les 5 minutes).
*   **Seuils** : Temps d'attente maximum (Timeout) avant de considérer le site comme inaccessible.
*   **Email (Alerting)** :
    *   Serveur SMTP (Host, Port).
    *   Identifiants (User, Password).
    *   Expéditeur et Destinataire(s).
*   **Logs** : Chemin du fichier de journalisation.

### B. Surveillance (Ping)
*   L'application effectue une requête HTTP `GET` vers l'URL cible.
*   **Succès** : Si le code de réponse est `200 OK`.
*   **Échec** : 
    *   Si le code est différent de 200 (ex: 404, 500).
    *   Si le site ne répond pas (Timeout).
    *   Si une erreur de connexion DNS/Réseau survient.

### C. Système de Rapport et Alerte
En cas d'échec (site inaccessible) :
1.  **Logging** : Écriture d'une ligne d'erreur dans un fichier de logs local (ex: `monitoring.log`) avec la date, l'heure et la raison de l'erreur.
2.  **Email** : Envoi immédiat d'une alerte par email à l'administrateur avec les détails de la panne.

### D. Intégration Web (Webhook) - Optionnel
Pour lier cette application autonome à la future interface web (Phase 2) :
*   L'application peut envoyer un rapport JSON via une requête `POST` à une URL configurée après chaque vérification.
*   Cela permet à l'interface web de construire des graphiques et l'historique sans interroger l'agent activement.
*   Si le Webhook échoue ou est désactivé, l'agent continue de fonctionner normalement (Logs + Emails).
L'application sera structurée simplement pour faciliter la maintenance :

```text
/ping_website
├── main.go           # Point d'entrée : lecture config, boucle principale
├── monitor/          # Logique de vérification (Ping)
│   └── ping.go
├── notifier/         # Gestion des alertes (Email, Logs)
│   ├── mail.go
│   └── logger.go
├── config.json       # Fichier de configuration utilisateur
├── monitoring.log    # Fichier de logs généré (automatiquement)
└── README.md         # Instructions de déploiement
```

## 5. Déploiement
Le processus de déploiement sera simplifié au maximum :
1.  **Compilation** : Générer l'exécutable (`monitor-app`).
2.  **Installation** : Copier l'exécutable et le `config.json` sur le serveur.
3.  **Exécution** : 
    *   Option 1 : Lancer en arrière-plan (Daemon/Service Systemd).
    *   Option 2 : Configurer via Cron pour une exécution périodique.

## 6. Évolution du Projet (Roadmap)
Le projet est divisé en deux phases distinctes :
*   **Phase 1 (Actuelle) :** Création de l'agent de monitoring autonome (cette application). Elle est responsable de la surveillance, du logging local et des alertes immédiates par email.
*   **Phase 2 (Future) :** Développement d'une interface web centralisée avec authentification utilisateur pour visualiser les métriques, l'historique des incidents et gérer les applications surveillées. 
    *   *Note pour la Phase 1 :* Les logs seront structurés de manière à pouvoir être facilement ingérés ou par la future interface web (ex: format JSON ou CSV si nécessaire).

## 7. Validation
Est-ce que ces spécifications couvrent l'ensemble de vos besoins pour la **Phase 1** ? Si oui, nous passerons à l'implémentation du code.
