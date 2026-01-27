# Guide d'utilisation de Prisma ORM

Prisma est l'outil qui fait le lien entre votre code Next.js et la base de données PostgreSQL. Il permet de manipuler les données avec du TypeScript au lieu du SQL pur.

## 1. Le Schéma (`prisma/schema.prisma`)
C'est le fichier central. Si vous voulez ajouter une table ou changer un champ :
1. Modifiez `schema.prisma`.
2. Appliquez les changements avec la commande ci-dessous.

## 2. Commandes Essentielles (Docker)

Comme nous utilisons Docker, l'utilisation directe de `npx prisma` sur votre machine peut échouer (manque de variables d'environnement). Utilisez toujours le **Makefile** ou passez par `docker compose exec` :

### Synchroniser la DB (Sans migration formelle)
C'est la commande la plus rapide pour le développement. Elle met à jour la DB pour qu'elle corresponde au schéma.
```bash
make db-init
# Équivalent de : docker compose exec web npx prisma db push
```

### Ouvrir Prisma Studio (Interface Visuelle)
Si vous voulez voir vos données dans une interface web (Excel-like) :
```bash
docker compose exec web npx prisma studio --browser none
```
*Note : Pour y accéder depuis votre navigateur, il faudra peut-être mapper le port 5555 dans le `docker-compose.yml`.*

### Régénérer le Client
Si vous changez le schéma, vous devez régénérer le client TypeScript pour avoir l'autocomplétion :
```bash
docker compose exec web npx prisma generate
```

## 3. Exemple de code (Comment l'utiliser)

### Lire des données
```typescript
import { prisma } from '@/lib/prisma';

const reports = await prisma.pingReport.findMany({
  where: { status: 'DOWN' },
  orderBy: { timestamp: 'desc' }
});
```

### Créer une donnée
```typescript
await prisma.pingReport.create({
  data: {
    targetUrl: 'https://example.com',
    status: 'UP',
    statusCode: 200,
    responseTime: 150.5
  }
});
```

## 4. Maintenance
Si vous voyez des erreurs de "Table non trouvée" ou "Relationship error", lancez toujours un `make db-init`.
