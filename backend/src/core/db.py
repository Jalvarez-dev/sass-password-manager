from sqlmodel import create_engine, Session, SQLModel
from .config import settings

engine=create_engine(settings.DATABASE_URL)

def get_session():
  with Session(engine) as session:
    yield session
def init_db():
  # En desarrollo crea las tablas automaticamente
  SQLModel.metadata.create_all(engine)