from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Fallback to SQLite for local testing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ayush.db")

engine = create_engine(
    DATABASE_URL,
    echo=True,       # Log SQL (set False in prod)
    future=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ Utility function to run Postgres extensions if available
def init_extensions(engine):
    if engine.dialect.name == "postgresql":
        with engine.connect() as conn:
            conn.execute("CREATE EXTENSION IF NOT EXISTS unaccent;")
            conn.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
            conn.commit()
