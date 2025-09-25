from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.db.database import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    GUIDE = "guide"
    VISITOR = "visitor"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.VISITOR, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    paypal_email = Column(String, nullable=True)
    bizum_phone = Column(String, nullable=True)

    # Relationships
    tours = relationship("Tour", back_populates="guide")
    ratings = relationship("Rating", back_populates="user")
    tips_given = relationship("Tip", back_populates="giver")