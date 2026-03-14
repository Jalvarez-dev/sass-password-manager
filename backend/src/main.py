from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.core.db import init_db
from src.modules.users.router import router as users_router
from src.modules.auth.router import router as auth_router
from src.modules.vault.router import router as vault_router

app=FastAPI(title=settings.PROJECT_NAME, version="0.1.0")

#Configurar CORS para permitir peticiones del frontend
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000", "http://localhost:5173"], # Origenes permitidos
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

# crear las tablas
@app.on_event("startup")
def on_startup():
  init_db()

# Prefijo global /api/v1/users
app.include_router(users_router, prefix=settings.API_V1_STR)

app.include_router(auth_router, prefix=settings.API_V1_STR)

app.include_router(vault_router,prefix=settings.API_V1_STR)

@app.get("/")
async def main():
  return {
        "message": "Hello from Backend",
        "environment": settings.ENVIRONMENT,
        "project_name": settings.PROJECT_NAME
    }
