# definimos como interactuamos con la BD
from sqlmodel import Session, select
from typing import Optional
from src.core.security import get_password_hash
from .models import User
from .schemas import UserCreate

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

    