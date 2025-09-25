from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.auth import get_current_active_user, require_roles
from app.models.user import User, UserRole
from app.models.tour import Tour
from app.models.point_of_interest import PointOfInterest
from app.models.multimedia import Multimedia, FileType
from app.schemas.multimedia import MultimediaResponse
from app.services.file_service import upload_kml_file, upload_multimedia_file, delete_file_from_gcs

router = APIRouter(tags=["uploads"])

def check_tour_ownership(tour_id: str, current_user: User, db: Session) -> Tour:
    """Helper function to check if user owns the tour or is admin"""
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    if current_user.role != UserRole.ADMIN and tour.guide_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this tour"
        )

    return tour

@router.post("/tours/{tour_id}/kml")
def upload_tour_kml(
    tour_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    """Upload KML file for a tour"""
    tour = check_tour_ownership(tour_id, current_user, db)

    # Delete existing KML file if it exists
    if tour.kml_file_url:
        delete_file_from_gcs(tour.kml_file_url)

    # Upload new KML file
    kml_url = upload_kml_file(file, tour_id)

    # Update tour with KML URL
    tour.kml_file_url = kml_url
    db.commit()

    return {"message": "KML file uploaded successfully", "kml_url": kml_url}

@router.post("/pois/{poi_id}/media", response_model=List[MultimediaResponse])
def upload_poi_multimedia(
    poi_id: str,
    files: List[UploadFile] = File(...),
    captions: List[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    """Upload multimedia files for a POI"""

    # Get POI and check ownership
    poi = db.query(PointOfInterest).filter(PointOfInterest.id == poi_id).first()
    if not poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not found"
        )

    tour = check_tour_ownership(str(poi.tour_id), current_user, db)

    uploaded_media = []

    for i, file in enumerate(files):
        # Determine file type
        if file.content_type.startswith("image/"):
            file_type = FileType.IMAGE
            file_category = "image"
        elif file.content_type.startswith("video/"):
            file_type = FileType.VIDEO
            file_category = "video"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {file.content_type}"
            )

        # Upload file
        file_url = upload_multimedia_file(file, str(tour.id), poi_id, file_category)

        # Create multimedia record
        caption = captions[i] if captions and i < len(captions) else None
        multimedia = Multimedia(
            poi_id=poi_id,
            file_url=file_url,
            file_type=file_type,
            caption=caption
        )

        db.add(multimedia)
        uploaded_media.append(multimedia)

    db.commit()

    # Refresh all multimedia objects
    for media in uploaded_media:
        db.refresh(media)

    return uploaded_media

@router.delete("/multimedia/{media_id}")
def delete_multimedia(
    media_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    """Delete a multimedia file"""

    multimedia = db.query(Multimedia).filter(Multimedia.id == media_id).first()
    if not multimedia:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Multimedia not found"
        )

    # Get POI and check ownership
    poi = db.query(PointOfInterest).filter(PointOfInterest.id == multimedia.poi_id).first()
    if not poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not found"
        )

    tour = check_tour_ownership(str(poi.tour_id), current_user, db)

    # Delete file from storage
    delete_file_from_gcs(multimedia.file_url)

    # Delete record from database
    db.delete(multimedia)
    db.commit()

    return {"message": "Multimedia deleted successfully"}

@router.get("/pois/{poi_id}/media", response_model=List[MultimediaResponse])
def get_poi_multimedia(
    poi_id: str,
    db: Session = Depends(get_db)
):
    """Get all multimedia for a POI"""

    # Check if POI exists and is accessible (tour is published)
    poi = db.query(PointOfInterest).filter(PointOfInterest.id == poi_id).first()
    if not poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not found"
        )

    tour = db.query(Tour).filter(Tour.id == poi.tour_id).first()
    if not tour or not tour.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not available"
        )

    multimedia = db.query(Multimedia).filter(Multimedia.poi_id == poi_id).all()
    return multimedia