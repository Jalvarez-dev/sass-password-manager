# frontend/Dockerfile

# ---------- Etapa Base ----------
FROM node:20-slim AS builder

WORKDIR /app

# Copiamos package files
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

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
FROM node:20-slim AS production

WORKDIR /app

# Copiar solo lo necesario desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Construimos la aplicación (vite ya está disponible)
RUN npm run build

# Instalamos un servidor estático
RUN npm install -g serve

EXPOSE 3000

# Servimos los archivos estáticos
CMD ["serve", "-s", "build", "-l", "3000", "-H", "0.0.0.0"]