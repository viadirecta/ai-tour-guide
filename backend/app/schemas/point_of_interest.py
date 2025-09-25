from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class POIBase(BaseModel):
    title: str
    description_raw: str
    latitude: float
    longitude: float
    order_in_tour: int

class POICreate(POIBase):
    pass

class POIUpdate(BaseModel):
    title: Optional[str] = None
    description_raw: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    order_in_tour: Optional[int] = None

class POIResponse(POIBase):
    id: str
    tour_id: str
    description_ai_enhanced: Optional[str] = None
    qr_code_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    multimedia: List["MultimediaResponse"] = []

    class Config:
        from_attributes = True

# Import here to avoid circular imports
from app.schemas.multimedia import MultimediaResponse
POIResponse.model_rebuild()