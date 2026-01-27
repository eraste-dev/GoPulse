# Package Monitor

Ce package gère la logique de vérification de la disponibilité du site web.

## Fonctions
- `CheckSite(url string, timeout int)` : Effectue la requête HTTP GET et mesure le temps de réponse.
- Retourne une structure `PingResult` contenant le statut, le code de réponse et la durée.

## Dépendances
- Standard Library (`net/http`, `time`).
