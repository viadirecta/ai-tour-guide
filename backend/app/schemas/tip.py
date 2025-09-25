from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.tip import PaymentMethod, TipStatus

class TipBase(BaseModel):
    amount: Decimal
    currency: str = "EUR"
    payment_method: PaymentMethod

class TipCreate(TipBase):
    pass

class TipResponse(TipBase):
    id: str
    tour_id: str
    giver_user_id: Optional[str] = None
    transaction_id: Optional[str] = None
    status: TipStatus
    created_at: datetime

    class Config:
        from_attributes = True