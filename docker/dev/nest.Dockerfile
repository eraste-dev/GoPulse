FROM node:20-alpine

WORKDIR /app

# Installation des dépendances pour le développement
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
RUN npm ci

# Le code source est monté, on lance le dev server
CMD ["npm", "run", "start:dev"]
