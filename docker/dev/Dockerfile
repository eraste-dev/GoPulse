FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma (required for Alpine)
RUN apk add --no-cache openssl

# Installation des dépendances pour le développement
COPY package.json package-lock.json* ./
RUN npm ci

# Le code source sera monté via un volume pour le hot-reload,
# donc pas de COPY . . ici pour éviter de masquer le volume.
# Cependant, nous voulons que le conteneur execute 'npm run dev' par défaut.

CMD ["npm", "run", "dev"]
