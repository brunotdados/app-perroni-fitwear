# ===== STAGE 1: build =====
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== STAGE 2: runtime =====
FROM nginx:1.27-alpine

# Copia config customizada do nginx (precisa existir no repo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados pelo Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
