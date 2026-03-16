from datetime import datetime, timedelta
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Category(SQLModel, table=True):
  id:Optional[int]=Field(default=None, primary_key=True)
  name:str=Field(unique=True, index=True)
  description: Optional[str]=None

  #Relacion inversa (una categoria tiene muchas entradas)
  entries: List["PasswordEntry"]=Relationship(back_populates="category")

class PasswordEntry(SQLModel, table=True):
  id: Optional[int]=Field(default=None, primary_key=True)
  site_name:str=Field(index=True)#ejemplo: facebook
  url: Optional[str]=None
  username_attr:str #nombre de usuario del sitio
  encrypted_password: str # AQUI CIFRADO AES-256

  # Agregar descripcion al vault
  description:str
  #Relacion con Categoria
  category_id:int=Field(foreign_key="category.id")
  category:Optional[Category]=Relationship(back_populates="entries")

  # relacion con usuario
  user_id: int = Field(foreign_key="user.id")

  #Gestion de expiracion
  created_at: datetime=Field(default_factory=datetime.utcnow)
  expires_at: datetime=Field(default_factory=lambda: datetime.utcnow()+timedelta(days=90))
  last_notified_at: Optional[datetime]=None