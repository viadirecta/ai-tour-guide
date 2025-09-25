from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.database import Base

class PointOfInterest(Base):
    __tablename__ = "points_of_interest"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tour_id = Column(UUID(as_uuid=True), ForeignKey("tours.id"), nullable=False)
    title = Column(String, nullable=False)
    description_raw = Column(Text, nullable=False)
    description_ai_enhanced = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    qr_code_url = Column(String, nullable=True, unique=True)
    order_in_tour = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    tour = relationship("Tour", back_populates="points_of_interest")
    multimedia = relationship("Multimedia", back_populates="poi", cascade="all, delete-orphan")