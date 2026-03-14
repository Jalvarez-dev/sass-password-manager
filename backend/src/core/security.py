from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from src.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# La llave debe ser un string de 32 bytes codificado en base64
cipher_suite = Fernet(settings.ENCRYPTION_KEY.encode())

def create_access_token(subject: Union[str, Any]) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def encrypt_password(password: str) -> str:
    """Cifra una cadena de texto a AES-256."""
    return cipher_suite.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password: str) -> str:
    """Descifra un token AES-256 al texto original."""
    return cipher_suite.decrypt(encrypted_password.encode()).decode()