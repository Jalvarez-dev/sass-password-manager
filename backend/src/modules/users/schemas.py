from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

# lo que se necesita para crear un usuario
class UserCreate(BaseModel):
  email: EmailStr
  password: str
  full_name: Optional[str]=None

# lo que devolvemos al frontend (no mostramos el password haseado)
class UserPublic(BaseModel):
  id: int
  email: EmailStr
  full_name: Optional[str]=None
  is_active: bool
  created_at: datetime

  # habilita leer los datos como atributos de un objeto (data.email) en lugar de data["email"]
  class Config:
    from_attributes=True
