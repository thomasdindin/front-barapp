# 1) Build avec Node.js
FROM node:20-alpine AS build
WORKDIR /app

# Copie des fichiers de dépendances et installation
COPY package*.json ./
RUN npm ci

# Copie du code source et compilation
COPY . .
RUN npm run build-only

# 2) Image Nginx pour servir le build
FROM nginx:1.25-alpine
# Où Nginx sert les fichiers statiques
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
