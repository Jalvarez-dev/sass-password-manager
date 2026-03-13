# Makefile

.PHONY: dev prod down clean logs logs-prod update-backend update-frontend

# Desarrollo - levanta todo con PostgreSQL local
dev:
	docker-compose -f docker-compose.yml up --build

dev-detached:
	docker-compose -f docker-compose.yml up -d --build

# Producción - levanta sin PostgreSQL (usando Supabase)
prod:
	docker-compose -f docker-compose.prod.yml up --build

prod-detached:
	docker-compose -f docker-compose.prod.yml up -d --build

# Bajar todos los contenedores
down:
	docker-compose -f docker-compose.yml down
	docker-compose -f docker-compose.prod.yml down

# Limpiar volúmenes (cuidado, borra datos de DB)
clean:
	docker-compose -f docker-compose.yml down -v
	docker system prune -f

# Logs
logs:
	docker-compose -f docker-compose.yml logs -f

logs-prod:
	docker-compose -f docker-compose.prod.yml logs -f

# Actualizar dependencias del backend (después de instalar nuevas librerías)
update-backend:
	@cd ../backend && ./scripts/update-deps.sh

# Actualizar dependencias del frontend
update-frontend:
	@cd ../frontend && ./scripts/update-deps.sh