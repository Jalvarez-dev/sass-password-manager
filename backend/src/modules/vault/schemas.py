from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryCreate(BaseModel):
  name:str
  description:Optional[str]=None

class CategoryPublic(BaseModel):
  id: int
  name: str
  description: Optional[str] = None

  class Config:
      from_attributes = True

class VaultCreate(BaseModel):
  site_name:str
  url:Optional[str]=None
  username_attr:str
  password_plain:str #recibimos la contraseña plana del front
  category_id:int

class VaultPublic(BaseModel):
  id: int
  site_name: str
  url: Optional[str]
  username_attr: str
  password_decrypted: str # Entregamos la contraseña ya descifrada
  category_id: int
  expires_at: datetime

  class Config:
    from_attributes = True