from sqlalchemy import Column, String, Text, Integer, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.database import Base

class Tour(Base):
    __tablename__ = "tours"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    guide_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, index=True)
    description = Column(Text)
    city = Column(String, nullable=False, index=True)
    country = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    duration_minutes = Column(Integer, nullable=True)
    kml_file_url = Column(String, nullable=True)
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    average_rating = Column(Float, default=0.0)
    total_ratings = Column(Integer, default=0)

    # Relationships
    guide = relationship("User", back_populates="tours")
    points_of_interest = relationship("PointOfInterest", back_populates="tour", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="tour", cascade="all, delete-orphan")
    tips = relationship("Tip", back_populates="tour", cascade="all, delete-orphan")