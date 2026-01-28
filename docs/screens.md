# Spécifications des Écrans (UI/UX)

Ce document détaille les différents écrans et fonctionnalités de l'interface utilisateur pour la plateforme GoPulse.

---

## 1. Application Cliente (Dashboard Utilisateur)
Interface principale pour la configuration des moniteurs, la réception d'alertes et l'analyse de disponibilité.

### 1.1 Gestion des Moniteurs Web (Core V1 – Critique)

#### Liste des Sites Surveillés (Website Inventory)
Tableau central listant tous les moniteurs du tenant.

| Colonne | Description / Valeurs |
| :--- | :--- |
| **URL / Nom** | Identifiant du moniteur |
| **Statut** | Temps réel : `Up` \| `Down` \| `Pending` \| `Paused` |
| **Code HTTP** | Dernier code reçu (ex: 200, 404, 500) |
| **Temps de Réponse** | Latence du dernier check (ms) |
| **Dernière Vérification** | Timestamp relatif (ex: il y a 2 min) |

**Actions rapides :**
- Pause / Reprendre
- Accès à la vue détail
- Suppression

#### Création & Configuration d’un Moniteur
Formulaire de configuration.

*   **Informations Générales**
    *   URL surveillée (cible)
    *   Nom lisible (Friendly name)
*   **Paramètres de Surveillance**
    *   Intervalle de check (selon le plan)
    *   Timeout HTTP
    *   Nombre d’échecs consécutifs avant incident (Threshold)
*   **Origine des Checks**
    *   Sélection de la région (Europe, US, Afrique, Asie)
*   **Validation**
    *   Bouton "Tester la connectivité" avant sauvegarde

### 1.2 Monitoring & Analyse de Performance

#### Dashboard Global
Vue d'ensemble du compte.
- **KPIs synthétiques :**
    - Uptime global (%)
    - Nombre de moniteurs `Down`
    - Temps de réponse moyen
- **Visualisations :**
    - Vue temps réel + tendances sur 24h / 7j

#### Vue Détail d’un Moniteur
- **Graphes :** Latence (Response Time / TTFB)
- **Uptime :** Heatmap d'uptime (vue mensuelle / annuelle)
- **Historique des incidents :** Table récapitulative (Date, Durée, Cause : HTTP code, timeout, DNS)

### 1.3 Alertes & Notifications (Core V1)

#### Contacts d’Alerte
- **Canaux :** Email, SMS, Slack, Webhook
- **Vérification :** Action de test pour chaque canal (ex: envoyer un email test)

#### Règles de Notification
- **Déclenchement :** Basé sur le nombre d'échecs ou la durée d'indisponibilité.
- **Escalade :** 
    - Niveau 1 → Immédiat
    - Niveau 2 → Après X minutes
- **Planification :** Horaires de silence (Mute / Maintenance window)

### 1.4 Reporting & Status Pages

#### Status Pages Publiques
- Sélection des moniteurs à afficher.
- **Personnalisation :** Logo, Nom, Domaine personnalisé.
- Historique public des incidents.

#### Exports & Rapports
- Rapports de disponibilité (SLA).
- **Formats :** PDF, CSV.
- Périodes configurables.

### 1.5 Paramètres du Compte (Tenant Settings)

#### Gestion des Utilisateurs
- Invitations par email.
- **Rôles :** Admin, Éditeur, Lecteur.
- Gestion des permissions par rôle.

#### Facturation & Abonnement
- Plan actuel et limites.
- Historique des paiements.
- Upgrade / Downgrade.

#### Accès API
- Génération de clés API.
- Permissions par token.
- Révocation.

---

### 1.6 Modules Futurs (Structure Prévue – Non V1)
- **Monitoring SSL :** Alertes expiration certificat (J-30, J-7).
- **DNS & Domaines :** Surveillance changements records et expiration domaine.
- **Infrastructure :** Monitoring ports (DB, SMTP, FTP), Ping, Heartbeat (Cron Jobs).
- **Content Integrity :** Keyword monitoring dans le corps HTML/JSON.

---

## 2. Application Administration (Super Admin)
Interface interne pour piloter la plateforme et l’infrastructure.

### 2.1 Gestion des Locataires (Tenants)
- **Dashboard Global Admin :** MRR, Taux de croissance, consommation globale de checks.
- **Liste des Tenants :** Recherche, plan actif, quotas, date d'inscription, statut.
- **Détail Tenant :** Impersonation (support), suspension/réactivation, logs d'activité.

### 2.2 Supervision de l’Infrastructure
- **Probe Nodes :** État de santé des sondes par région, latence moyenne, taux d'erreur.
- **Pipeline de Checks :** Volume par seconde, état des files d'attente, alertes de saturation.

### 2.3 Gestion des Plans & Offres
- Définition des forfaits (Nb moniteurs, intervalle mini, canaux autorisés).
- Gestion des coupons & promotions.

### 2.4 Support & Communication
- Système de tickets support.
- Annonces globales (Maintenance, news fonctionnalités).

### 2.5 Sécurité & Audit
- Audit logs administrateur.
- Détection d'abus API (création massive de moniteurs).