# backend/Dockerfile

# ---------- Etapa Base ----------
FROM python:3.11-alpine AS builder

WORKDIR /app

# Variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Instalamos dependencias de compilación
RUN apk add --no-cache gcc musl-dev postgresql-dev

# Copiamos requirements.txt
COPY requirements.txt .

# Instalamos dependencias
RUN pip install --no-cache-dir -r requirements.txt

# ---------- Etapa de Desarrollo ----------
FROM builder AS development

# Copiamos el código
COPY . .

EXPOSE 8000

# Comando para desarrollo con hot-reload
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ---------- Etapa de Producción ----------
FROM builder AS production

# Creamos usuario no-root
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup

# Copiamos el código
COPY . .

# Cambiamos propiedad
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Sin --reload en producción
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]