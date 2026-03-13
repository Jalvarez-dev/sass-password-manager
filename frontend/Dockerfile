# frontend/Dockerfile

# ---------- Etapa Base ----------
FROM node:20-slim AS builder

WORKDIR /app

# Copiamos package files
COPY package*.json ./

# Instalamos dependencias
RUN npm ci --only=production

# ---------- Etapa de Desarrollo ----------
FROM builder AS development

# Instalammos también dependencias de desarrollo para hot-reload
RUN npm install --only=development

# Copiamos el código
COPY . .

EXPOSE 3000

# En desarrollo, usamos el servidor de React con hot-reload
CMD ["npm", "run", "dev"]

# ---------- Etapa de Producción ----------
FROM builder AS production

# Copiamos el código
COPY . .

# Construimos la aplicación para producción
RUN npm run build

# Instalamos un servidor estático simple para servir la app
RUN npm install -g serve

EXPOSE 3000

# Servimos los archivos estáticos
CMD ["serve", "-s", "build", "-l", "3000"]