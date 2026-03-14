# definimos la tbal fisica en PostgreSQL
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int]=Field(default=None, primary_key=True)
    email: str=Field(unique=True, index=True, nullable=False)
    full_name: Optional[str]=None
    hashed_password: str=Field(nullable=False)
    is_active: bool=Field(default=True)
    created_at: datetime=Field(default_factory=datetime.utcnow)