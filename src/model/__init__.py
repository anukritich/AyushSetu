from .base import Base, engine, SessionLocal, init_extensions
from .medical_tradition import MedicalTradition
from .ayush_term import AyushTerm

def init_db():
    """Create all tables and enable extensions if Postgres."""
    init_extensions(engine)
    Base.metadata.create_all(bind=engine)
