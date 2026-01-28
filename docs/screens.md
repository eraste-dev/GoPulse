# Spécifications des Écrans (UI/UX)

Ce document détaille les différents écrans et fonctionnalités de l'interface utilisateur pour la plateforme GoPulse.

---

## Légende des Statuts

| Statut | Description |
|:------:|:------------|
| ✅ | **Terminé** - Implémenté et testé |
| 🚧 | **En cours** - En développement |
| 📋 | **Planifié** - Prévu prochainement |
| ❌ | **Non commencé** - À faire |
| 🔮 | **Futur** - Version ultérieure |

---

## 1. Application Cliente (Dashboard Utilisateur)
Interface principale pour la configuration des moniteurs, la réception d'alertes et l'analyse de disponibilité.

### 1.1 Gestion des Moniteurs Web (Core V1 – Critique)

#### Liste des Sites Surveillés (Website Inventory) ✅

| Statut | Fonctionnalité |
|:------:|:---------------|
| ✅ | Tableau listant tous les moniteurs |
| ✅ | Colonnes : URL/Nom, Statut, Code HTTP, Temps de réponse, Dernière vérification |
| ✅ | Action : Pause / Reprendre |
| ✅ | Action : Suppression |
| 📋 | Action : Accès à la vue détail |

#### Création & Configuration d'un Moniteur ✅

| Statut | Fonctionnalité |
|:------:|:---------------|
| ✅ | URL surveillée (cible) |
| ✅ | Nom lisible (Friendly name) |
| ✅ | Méthode HTTP (GET, HEAD, POST) |
| ✅ | Intervalle de check |
| ✅ | Timeout HTTP |
| ✅ | Seuil d'échecs consécutifs (Threshold) |
| ✅ | Sélection de la région |
| ✅ | Bouton "Tester la connectivité" |

### 1.2 Monitoring & Analyse de Performance

#### Dashboard Global ✅

| Statut | Fonctionnalité |
|:------:|:---------------|
| ✅ | KPI : Uptime global (%) |
| ✅ | KPI : Nombre de moniteurs Down |
| ✅ | KPI : Temps de réponse moyen |
| ✅ | KPI : Total des moniteurs |
| ✅ | Graphique : Tendances 24h / 7j |
| ✅ | Sélecteur de période (24h / 7j) |
| ✅ | Bouton Refresh |
| 📋 | Vue temps réel (WebSocket) |

#### Vue Détail d'un Moniteur ✅

| Statut | Fonctionnalité |
|:------:|:---------------|
| ✅ | Layout 1/3 détails + 2/3 graphiques |
| ✅ | Carte détails moniteur (config, status, actions) |
| ✅ | Graphe de latence (Response Time) |
| ✅ | Historique des statuts (barre colorée UP/DOWN) |
| ✅ | Stats rapides (uptime, avg/min/max response) |
| ✅ | Sélecteur de période (24h / 7j / 30d) |
| ✅ | Actions (Pause/Resume, Edit, Delete) |
| ✅ | Blocs promo/tutoriels réutilisables |
| ✅ | Export des données (CSV/JSON) |
| 📋 | Heatmap d'uptime (vue mensuelle / annuelle) |

### 1.3 Alertes & Notifications (Core V1) ❌

#### Contacts d'Alerte

| Statut | Fonctionnalité |
|:------:|:---------------|
| ❌ | Canal : Email |
| ❌ | Canal : SMS |
| 🔮 | Canal : Slack |
| 🔮 | Canal : Webhook |
| ❌ | Action de test pour chaque canal |

#### Règles de Notification

| Statut | Fonctionnalité |
|:------:|:---------------|
| ❌ | Déclenchement basé sur le nombre d'échecs |
| ❌ | Déclenchement basé sur la durée d'indisponibilité |
| 🔮 | Escalade (Niveau 1 → Niveau 2) |
| 🔮 | Horaires de silence (Maintenance window) |

### 1.4 Reporting & Status Pages 🔮

#### Status Pages Publiques

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Sélection des moniteurs à afficher |
| 🔮 | Personnalisation : Logo, Nom |
| 🔮 | Domaine personnalisé |
| 🔮 | Historique public des incidents |

#### Exports & Rapports

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Rapports de disponibilité (SLA) |
| 🔮 | Export PDF |
| 🔮 | Export CSV |
| 🔮 | Périodes configurables |

### 1.5 Paramètres du Compte (Tenant Settings)

#### Gestion des Utilisateurs ✅

| Statut | Fonctionnalité |
|:------:|:---------------|
| ✅ | Liste des utilisateurs |
| ✅ | Création d'utilisateur |
| ✅ | Rôles : Admin, Éditeur, Lecteur |
| ✅ | Gestion des permissions par rôle |
| 📋 | Invitations par email |

#### Facturation & Abonnement 🔮

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Plan actuel et limites |
| 🔮 | Historique des paiements |
| 🔮 | Upgrade / Downgrade |

#### Accès API 🔮

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Génération de clés API |
| 🔮 | Permissions par token |
| 🔮 | Révocation |

---

### 1.6 Modules Futurs (Structure Prévue – Non V1) 🔮

| Statut | Module |
|:------:|:-------|
| 🔮 | **Monitoring SSL** : Alertes expiration certificat (J-30, J-7) |
| 🔮 | **DNS & Domaines** : Surveillance changements records et expiration domaine |
| 🔮 | **Infrastructure** : Monitoring ports (DB, SMTP, FTP), Ping, Heartbeat (Cron Jobs) |
| 🔮 | **Content Integrity** : Keyword monitoring dans le corps HTML/JSON |

---

## 2. Application Administration (Super Admin) 🔮
Interface interne pour piloter la plateforme et l'infrastructure.

### 2.1 Gestion des Locataires (Tenants)

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Dashboard Global Admin : MRR, Taux de croissance |
| 🔮 | Liste des Tenants : Recherche, plan actif, quotas |
| 🔮 | Détail Tenant : Impersonation, suspension/réactivation |
| 🔮 | Logs d'activité |

### 2.2 Supervision de l'Infrastructure

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Probe Nodes : État de santé des sondes par région |
| 🔮 | Pipeline de Checks : Volume par seconde |
| 🔮 | Alertes de saturation |

### 2.3 Gestion des Plans & Offres

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Définition des forfaits |
| 🔮 | Gestion des coupons & promotions |

### 2.4 Support & Communication

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Système de tickets support |
| 🔮 | Annonces globales |

### 2.5 Sécurité & Audit

| Statut | Fonctionnalité |
|:------:|:---------------|
| 🔮 | Audit logs administrateur |
| 🔮 | Détection d'abus API |

---

## Résumé de Progression

| Section | Progression |
|:--------|:------------|
| 1.1 Gestion des Moniteurs | ██████████ 95% |
| 1.2 Monitoring & Analyse | ██████████ 95% |
| 1.3 Alertes & Notifications | ░░░░░░░░░░ 0% |
| 1.4 Reporting & Status Pages | ░░░░░░░░░░ 0% |
| 1.5 Paramètres du Compte | ██████░░░░ 60% |
| 2.x Administration | ░░░░░░░░░░ 0% |

**Dernière mise à jour :** 2026-01-28
