from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
  PROJECT_NAME: str = "Password Manager API"
  API_V1_STR: str = "/api/v1"

  # se le desde el .env en la raiz de /backend
  DATABASE_URL: str = "postgresql://user:pass@db:5432/dbname"

  ACCESS_TOKEN_EXPIRE_MINUTES:int=60
  SECRET_KEY: str = "LLA_SECRETA_PARA_JWT"
  ALGORITHM: str = "HS256"
  ENVIRONMENT: str
  ENCRYPTION_KEY: str
  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
    extra="ignore"
  )

settings=Settings()

