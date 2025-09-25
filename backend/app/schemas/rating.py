from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RatingBase(BaseModel):
    rating: int  # 1-5 scale
    comment: Optional[str] = None

class RatingCreate(RatingBase):
    pass

class RatingResponse(RatingBase):
    id: str
    tour_id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True