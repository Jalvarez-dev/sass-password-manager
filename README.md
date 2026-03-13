# Manual Técnico: Desarrollo y Producción con Docker

## Estructura del Proyecto

```
proyecto/
├── infra/                          # ← Toda la configuración de infraestructura
│   ├── docker-compose.yml          # Composición para desarrollo (con postgres)
│   ├── docker-compose.prod.yml     # Composición para producción (sin postgres)
│   ├── Makefile                    # Comandos mágicos (make)
│   └── scripts/                    # (Opcional) Scripts auxiliares
├── backend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env (no versionado)
│   ├── scripts/
│   │   └── update-deps.sh          # Script para backend
│   └── src/
│       └── main.py
└── frontend/
    ├── .dockerignore
    ├── Dockerfile
    ├── package.json
    ├── package-lock.json
    ├── .env (no versionado)
    ├── scripts/
    │   └── update-deps.sh          # Script para frontend
    └── src/
        └── ...
```

## Requisitos previos

- Docker y Docker Compose instalados.
- Git.
- (Opcional) Python 3.11 y node para desarrollo local.

---

## 1. Primeros pasos (solo una vez)

```bash
# Clonar el repositorio
git clone <url-del-repositorio> proyecto
cd proyecto

# Crear archivos de entorno (nunca se versionan)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Editar con tus variables locales
nano backend/.env
nano frontend/.env

# Dar permisos a los scripts (solo una vez)
chmod +x backend/scripts/update-deps.sh
chmod +x frontend/scripts/update-deps.sh

# Ir a la carpeta de infraestructura (desde aquí ejecutarás todo)
cd infra
```

---

## 2. Comandos diarios para desarrollo (desde `infra/`)

### Levantar el entorno

```bash
# Modo interactivo (logs en pantalla)
make dev

# Modo background (libera la terminal)
make dev-detached
```

### Ver logs

```bash
# Todos los servicios
make logs

# Solo backend
docker-compose -f docker-compose.yml logs -f backend

# Solo frontend
docker-compose -f docker-compose.yml logs -f frontend
```

### Detener

```bash
# Baja todos los contenedores (los datos de postgres persisten)
make down
```

### Acceder a un contenedor

```bash
# Backend (shell)
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# Postgres
docker-compose exec postgres psql -U myuser myapp_dev
```

### Reconstruir un servicio específico (si ya está corriendo)

```bash
# Backend
docker-compose -f docker-compose.yml up -d --build backend

# Frontend
docker-compose -f docker-compose.yml up -d --build frontend
```

---

## 3. Gestión de dependencias (cómo agregar librerías)

### Backend (Python)

#### Ejemplo: agregar `python-jose` (JWT)

```bash
# 1. Ir a backend
cd ../backend

## antes activar el entorno virtual si no lo tiene c rearlo
python -m venv venv
source venv/bin/activate
# 2. Instalar localmente (recomendado para probar)
pip install python-jose[cryptography]

# 3. Actualizar requirements.txt con el script
./scripts/update-deps.sh

# 4. Volver a infra y reconstruir
cd ../infra
make dev   # o docker-compose up --build backend

# 5. Probar que funcione (hacer peticiones, etc.)

# 6. Commit de los cambios
git add ../backend/requirements.txt ../backend/src/...
git commit -m "add python-jose"
git push
```

**Nota:** Si prefieres no instalar localmente, puedes editar manualmente `requirements.txt` (añadir la línea) y luego reconstruir.

### Frontend (Node.js)

#### Ejemplo: agregar `axios`

```bash
# 1. Ir a frontend
cd ../frontend

# 2. Instalar (esto actualiza package.json y package-lock.json automáticamente)
npm install axios

# 3. (Opcional) Verificar con el script
./scripts/update-deps.sh   # solo muestra estado, no modifica

# 4. Volver a infra y reconstruir
cd ../infra
make dev   # o docker-compose up --build frontend

# 5. Commit
git add ../frontend/package.json ../frontend/package-lock.json
git commit -m "add axios"
git push
```

#### Para actualizar todas las dependencias a las últimas versiones compatibles:

```bash
cd ../frontend
./scripts/update-deps.sh   # ejecuta npm update y muestra cambios
# Luego commit de package-lock.json si hubo cambios
```

---

## 4. Preparación y despliegue a producción

### 4.1. Probar imagen de producción localmente

```bash
# Backend
cd ../backend
docker build --target production -t mi-backend:latest .
docker run -p 8000:8000 --env-file .env mi-backend:latest

# Frontend
cd ../frontend
docker build --target production -t mi-frontend:latest .
docker run -p 3000:3000 mi-frontend:latest
```

### 4.2. Usar docker-compose de producción (local o en servidor)

Desde `infra/`:

```bash
# Levantar producción (con logs en pantalla)
make prod

# O en background (modo demonio)
make prod-detached

# Ver logs de producción
make logs-prod

# Detener producción
make down
```

---

## 5. Despliegue en servidor real

### 5.1. Primer despliegue

```bash
# Conectarse por SSH
ssh usuario@tuservidor

# Clonar el proyecto (si no está)
git clone <url> /app
cd /app

# Crear archivos .env con valores de producción
nano backend/.env
nano frontend/.env

# Ir a infra
cd infra

# Levantar en producción
make prod-detached
```

### 5.2. Actualización tras cambios (código o dependencias)

```bash
ssh usuario@tuservidor
cd /app
git pull
cd infra
make prod-detached   # reconstruye y reinicia
```

---

## 6. Explicación de los scripts de actualización (cuándo y por qué)

### Backend (`backend/scripts/update-deps.sh`)

- **¿Qué hace?** Ejecuta `pip freeze > requirements.txt`, escribiendo **todas** las librerías instaladas en tu entorno local con sus versiones exactas.
- **¿Cuándo usarlo?** **Después** de instalar una nueva librería con `pip install`, o después de modificar manualmente `requirements.txt` (para sincronizar).  
- **¿Por qué?** Garantiza que el archivo refleje exactamente lo que tienes funcionando localmente.

### Frontend (`frontend/scripts/update-deps.sh`)

- **¿Qué hace?** Muestra las dependencias desactualizadas (`npm outdated`) y ejecuta `npm update`, que actualiza `package-lock.json` respetando los rangos de versiones de `package.json`.
- **¿Cuándo usarlo?** Cuando quieras actualizar todas las dependencias a las últimas versiones **dentro de los rangos permitidos** (por ejemplo, después de un tiempo sin actualizar).  
- **¿Por qué?** Mantiene las dependencias al día sin romper compatibilidad (si respetas semver).

**Importante:** Cuando instalas un paquete nuevo con `npm install <paquete>`, no necesitas el script, porque `npm` ya actualiza `package.json` y `package-lock.json`.

---

## 7. Resumen de comandos más usados (desde `infra/`)

| Qué quieres hacer | Comando |
|-------------------|---------|
| Levantar desarrollo (con logs) | `make dev` |
| Levantar desarrollo en background | `make dev-detached` |
| Ver logs de desarrollo | `make logs` |
| Detener todo | `make down` |
| Reconstruir backend | `docker compose up -d --build backend` |
| Reconstruir frontend | `docker compose -d --build frontend` |
| Backend: instalar lib y actualizar requirements | `cd ../backend && pip install lib && ./scripts/update-deps.sh` (luego commit y reconstruir) |
| Frontend: instalar lib | `cd ../frontend && npm install lib` (automático) |
| Probar producción local | `make prod` |
| Levantar producción en servidor | `make prod-detached` |
| Ver logs de producción | `make logs-prod` |

---

## 8. Buenas prácticas finales

- **Siempre** versiona `requirements.txt`, `package.json` y `package-lock.json` después de cambios.
- **Reconstruye** el contenedor después de modificar dependencias (con `--build`).
- **Nunca** subas archivos `.env` al repositorio.
- Si trabajas en equipo, sincroniza estos scripts y el Makefile para que todos usen los mismos comandos.

Con este manual, tu flujo es simple:  
1. `cd infra`  
2. `make dev` para empezar a desarrollar  
3. Cuando agregues librerías, usas los scripts y luego reconstruyes  
4. Para producción, `make prod-detached` en el servidor tras hacer `git pull`.

¿Todo claro? Así puedes enfocarte en el código sin perder tiempo con comandos complejos.