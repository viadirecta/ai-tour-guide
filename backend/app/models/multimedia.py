from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.db.database import Base

class FileType(enum.Enum):
    IMAGE = "image"
    VIDEO = "video"

class Multimedia(Base):
    __tablename__ = "multimedia"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    poi_id = Column(UUID(as_uuid=True), ForeignKey("points_of_interest.id"), nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(Enum(FileType), nullable=False)
    caption = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    poi = relationship("PointOfInterest", back_populates="multimedia")