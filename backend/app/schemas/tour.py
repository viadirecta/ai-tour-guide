from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TourBase(BaseModel):
    title: str
    description: Optional[str] = None
    city: str
    country: str
    category: str
    duration_minutes: Optional[int] = None

class TourCreate(TourBase):
    pass

class TourUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    category: Optional[str] = None
    duration_minutes: Optional[int] = None

class TourResponse(TourBase):
    id: str
    guide_id: str
    kml_file_url: Optional[str] = None
    is_published: bool
    created_at: datetime
    updated_at: datetime
    average_rating: float
    total_ratings: int

    class Config:
        from_attributes = True

class TourListResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    city: str
    country: str
    category: str
    duration_minutes: Optional[int] = None
    average_rating: float
    total_ratings: int
    guide_username: str

    class Config:
        from_attributes = True