from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List
from pydantic import BaseModel

import os

load_dotenv()

app=FastAPI(title="Mi Api", version="0.1.0")

#Configurar CORS para permitir peticiones del frontend
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000", "http://localhost:5173"], # Origenes permitidos
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)
class Persona(BaseModel):
  id:int
  nombre:str
  edad:int
  email:str
  ciudad:str
  profesion:str
  avatar:str
  
PERSONAS_FAKE=[
  {
        "id": 1,
        "nombre": "Ana García",
        "edad": 28,
        "email": "ana.garcia@email.com",
        "ciudad": "Madrid",
        "profesion": "Ingeniera de Software",
        "avatar": "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
        "id": 2,
        "nombre": "Carlos Rodríguez",
        "edad": 34,
        "email": "carlos.rodriguez@email.com",
        "ciudad": "Barcelona",
        "profesion": "Arquitecto",
        "avatar": "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
        "id": 3,
        "nombre": "María López",
        "edad": 31,
        "email": "maria.lopez@email.com",
        "ciudad": "Valencia",
        "profesion": "Médica",
        "avatar": "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
        "id": 4,
        "nombre": "Javier Martínez",
        "edad": 42,
        "email": "javier.martinez@email.com",
        "ciudad": "Sevilla",
        "profesion": "Profesor",
        "avatar": "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
        "id": 5,
        "nombre": "Laura Sánchez",
        "edad": 26,
        "email": "laura.sanchez@email.com",
        "ciudad": "Bilbao",
        "profesion": "Diseñadora UX",
        "avatar": "https://randomuser.me/api/portraits/women/5.jpg"
    }
]
@app.get("/")
async def main():
  return {
        "message": "Hello from Backend",
        "environment": os.getenv("ENVIRONMENT", "not set"),
        "database": os.getenv("DATABASE_URL", "not set").split("@")[0] + "@..."  # Oculta password
    }

@app.get("/api/test")
async def test():
  return {
    "status":"ok",
    "backend":"conncected",
    "env":os.getenv("ENVIRONMENT")
  }

@app.get("/api/personas", response_model=List[Persona])
async def get_personas():
  return PERSONAS_FAKE

@app.get("/api/personas/{persona_id}", response_model=Persona)
async def get_persona(persona_id:int):
  for persona in PERSONAS_FAKE:
    if persona["id"] == persona_id:
      return persona
  return {
    "error":"Perosna no encontrada"
  }

@app.get("/health")
async def health():
  return {
    "status":"healty"
  }