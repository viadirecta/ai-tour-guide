from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.db.database import Base

class PaymentMethod(enum.Enum):
    PAYPAL = "paypal"
    BIZUM = "bizum"
    QR_STATIC = "qr_static"

class TipStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class Tip(Base):
    __tablename__ = "tips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tour_id = Column(UUID(as_uuid=True), ForeignKey("tours.id"), nullable=False)
    giver_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Nullable for anonymous tips
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="EUR")
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    transaction_id = Column(String, nullable=True)  # From payment gateway
    status = Column(Enum(TipStatus), default=TipStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    tour = relationship("Tour", back_populates="tips")
    giver = relationship("User", back_populates="tips_given")