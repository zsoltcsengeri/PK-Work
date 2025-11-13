from sqlalchemy import Column, Integer, String, Text, DateTime, func
from .database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    phone = Column(String(50))
    website = Column(String(200))
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
