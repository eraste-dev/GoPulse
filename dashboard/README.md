# GoPulse Dashboard (Frontend & API)

Ce dossier contient l'interface web de monitoring et l'API de réception des données.

## Stack Technique
- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS + Shadcn UI
- **Base de données** : PostgreSQL via Prisma ORM
- **Authentification** : NextAuth.js (Provider Credentials)
- **Graphiques** : Recharts

## Structure
- `/src/app/api/report` : Point d'entrée Webhook pour l'agent.
- `/src/app/dashboard` : Page principale de visualisation des métriques.
- `/src/app/login` : Page d'authentification.
- `/prisma` : Schéma de la base de données.

## Développement Local
1. `npm install`
2. Configurez `DATABASE_URL` dans un fichier `.env`.
3. `npx prisma db push`
4. `npm run dev`
