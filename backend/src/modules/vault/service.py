from sqlmodel import Session, select
from src.core.security import encrypt_password
from .models import PasswordEntry, Category
from .schemas import VaultCreate, CategoryCreate

class VaultService:
  @staticmethod
  def create_category(db:Session, cat_in:CategoryCreate)->Category:
    db_cat=Category(name=cat_in.name, description=cat_in.description)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat
  
  @staticmethod
  def get_categories(db:Session):
    return db.exec(select(Category)).all()
  
  @staticmethod
  def create_entry(db:Session, entry_in:VaultCreate, user_id:int)->PasswordEntry:
    # 1.CIFRAR la contraseña antes de guardar
    encrypted=encrypt_password(entry_in.password_plain)

    # 2. Crear objeto del modelo
    db_entry=PasswordEntry(
      site_name=entry_in.site_name,
      url=entry_in.url,
      username_attr=entry_in.username_attr,
      encrypted_password=encrypted,
      description=entry_in.description,
      category_id=entry_in.category_id,
      user_id=user_id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry
  
  @staticmethod
  def get_user_entries(db:Session, user_id:int):
    """Obtiene todas las entradas de un usuario especifico"""
    statement=select(PasswordEntry).where(PasswordEntry.user_id==user_id)
    results=db.exec(statement).all()
    
    return results