from sqlalchemy import Column, Integer, String, Index
from sqlalchemy.orm import relationship
from .base import Base

class MedicalTradition(Base):
    __tablename__ = "medical_traditions"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False, index=True)

    # One-to-many with AyushTerm
    terms = relationship("AyushTerm", back_populates="tradition", cascade="all, delete-orphan")

# ✅ Index for fast lookup by name
Index("ix_tradition_name", MedicalTradition.name)
