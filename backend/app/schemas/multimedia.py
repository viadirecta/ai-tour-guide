from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.multimedia import FileType

class MultimediaResponse(BaseModel):
    id: str
    poi_id: str
    file_url: str
    file_type: FileType
    caption: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True