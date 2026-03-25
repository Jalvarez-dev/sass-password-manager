# definimos como interactuamos con la BD
from sqlmodel import Session, select
from typing import Optional
from src.core.security import get_password_hash,verify_password
from .models import User
from .schemas import UserCreate,UserUpdate,UserUpdatePassword

class UserService:
    @staticmethod
    def get_by_id(db:Session, user_id:int)->Optional[User]:
        return db.get(User, user_id)
    
    @staticmethod
    def get_by_email(db: Session, email: str)->Optional[User]:
        statement=select(User).where(User.email == email)
        return db.exec(statement).first()
    
    @staticmethod
    def create(db: Session, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=get_password_hash(user_in.password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def updateUser(db:Session, user:User ,update_user_in: UserUpdate) -> User:
        #convertimos los datos optenidos a diccionario
        update_data=update_user_in.dict(exclude_unset=True)#nos aseguramos que solo son los campos proporcianados

        # iteramo sobre los campos y agregamos solo aquellos que su valor no sea None
        for field,value in update_data.items():
            if hasattr(user, field) and value is not None:
                setattr(user, field, value)

        #guardamos cambios
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def updateUserPassword(db: Session, user:User ,password_user_in: UserUpdatePassword)-> User:
        if not verify_password(password_user_in.current_password,user.hashed_password):
            raise ValueError("La contraseña actual es incorrecta")
        user.hashed_password=get_password_hash(password_user_in.new_password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user