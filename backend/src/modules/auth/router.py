from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from src.core.db import get_session
from src.core.security import create_access_token, verify_password
from src.modules.users.service import UserService
from .schemas import Token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_session),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    # Buscamos al usuario
    user = UserService.get_by_email(db, email=form_data.username)
    
    # Validamos existencia y contraseña
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generamos el JWT
    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
    }