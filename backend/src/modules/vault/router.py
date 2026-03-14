from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.core.db import get_session
from src.core.security import decrypt_password # Importamos el descifrador
from src.modules.auth.deps import get_current_user
from src.modules.users.models import User

from .models import PasswordEntry
from .schemas import VaultCreate, VaultPublic, CategoryCreate, CategoryPublic
from .service import VaultService

router = APIRouter(prefix="/vault", tags=["vault"])

# --- Endpoints de Categorías ---
@router.post("/categories",response_model=CategoryPublic)
def create_category(
  cat_in:CategoryCreate,
  db: Session=Depends(get_session),
  current_user: User=Depends(get_current_user)
):
  return VaultService.create_category(db, cat_in)

@router.get("/categories", response_model=List[CategoryPublic])
def list_categories(db:Session=Depends(get_session)):
  return VaultService.get_categories(db)

# --- Endpoints de la Bóveda ---

@router.post("/entries", response_model=VaultPublic)
def create_password_entry(
    entry_in: VaultCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # El service se encarga de cifrar antes de guardar
    db_entry = VaultService.create_entry(db, entry_in, user_id=current_user.id)
    
    # Desciframos solo para la respuesta inmediata del post
    return VaultPublic(
        **db_entry.model_dump(),
        password_decrypted=decrypt_password(db_entry.encrypted_password)
    )

@router.get("/entries", response_model=List[VaultPublic])
def list_my_passwords(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Lista todas las contraseñas del usuario logueado descifradas."""
    entries = VaultService.get_user_entries(db, user_id=current_user.id)
    # Transformamos cada entrada de la DB al esquema público descifrando la clave
    return [
        VaultPublic(
            **entry.model_dump(),
            password_decrypted=decrypt_password(entry.encrypted_password)
        ) for entry in entries
    ]