# definimos las enpoint
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.core.db import get_session

from src.modules.auth.deps import get_current_user
from src.modules.users.models import User
from .schemas import UserCreate, UserPublic, UserUpdate, UserUpdatePassword
from .service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_session)):
    user_exists=UserService.get_by_email(db, email=user_in.email)
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    return UserService.create(db, user_in)

@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: User=Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserPublic)
def update_user_me(
    user_data:UserUpdate,
    db:Session=Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        user_update=UserService.updateUser(db,user=current_user,update_user_in=user_data)
        return user_update
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))
    
@router.post("/me/password", response_model=UserPublic)
def update_password_user_me(
    user_password:UserUpdatePassword,
    db:Session=Depends(get_session),
    current_user:User=Depends(get_current_user)
):
    try:
        user_update_password=UserService.updateUserPassword(db,user=current_user,password_user_in=user_password)
        return user_update_password
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al actualizar la contraseña")