from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.auth import get_current_active_user, require_roles
from app.models.user import User, UserRole
from app.models.tour import Tour
from app.models.point_of_interest import PointOfInterest
from app.schemas.point_of_interest import POICreate, POIUpdate, POIResponse
from app.services.gemini_service import enhance_poi_description
from app.services.qr_service import generate_poi_qr_code

router = APIRouter(tags=["points_of_interest"])

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

@router.post("/tours/{tour_id}/pois", response_model=POIResponse)
def create_poi(
    tour_id: str,
    poi: POICreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    tour = check_tour_ownership(tour_id, current_user, db)

    # Create POI
    db_poi = PointOfInterest(
        **poi.dict(),
        tour_id=tour_id
    )

    # Generate AI-enhanced description
    enhanced_description = enhance_poi_description(
        title=poi.title,
        raw_description=poi.description_raw,
        city=tour.city,
        country=tour.country,
        category=tour.category
    )
    db_poi.description_ai_enhanced = enhanced_description

    db.add(db_poi)
    db.flush()  # Get the POI ID without committing

    # Generate QR code
    qr_code_url = generate_poi_qr_code(tour_id, str(db_poi.id))
    if qr_code_url:
        db_poi.qr_code_url = qr_code_url

    db.commit()
    db.refresh(db_poi)
    return db_poi

@router.put("/tours/{tour_id}/pois/{poi_id}", response_model=POIResponse)
def update_poi(
    tour_id: str,
    poi_id: str,
    poi_update: POIUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    tour = check_tour_ownership(tour_id, current_user, db)

    poi = db.query(PointOfInterest).filter(
        PointOfInterest.id == poi_id,
        PointOfInterest.tour_id == tour_id
    ).first()

    if not poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not found"
        )

    # Update fields
    update_data = poi_update.dict(exclude_unset=True)
    description_changed = False

    for field, value in update_data.items():
        if field == "description_raw" and value != poi.description_raw:
            description_changed = True
        setattr(poi, field, value)

    # Re-generate AI description if raw description changed
    if description_changed:
        enhanced_description = enhance_poi_description(
            title=poi.title,
            raw_description=poi.description_raw,
            city=tour.city,
            country=tour.country,
            category=tour.category
        )
        poi.description_ai_enhanced = enhanced_description

    db.commit()
    db.refresh(poi)
    return poi

@router.delete("/tours/{tour_id}/pois/{poi_id}")
def delete_poi(
    tour_id: str,
    poi_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    tour = check_tour_ownership(tour_id, current_user, db)

    poi = db.query(PointOfInterest).filter(
        PointOfInterest.id == poi_id,
        PointOfInterest.tour_id == tour_id
    ).first()

    if not poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not found"
        )

    db.delete(poi)
    db.commit()
    return {"message": "POI deleted successfully"}

@router.get("/tours/{tour_id}/pois", response_model=List[POIResponse])
def list_tour_pois(
    tour_id: str,
    db: Session = Depends(get_db)
):
    # Check if tour exists and is published (for public access)
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    if not tour.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not available"
        )

    pois = db.query(PointOfInterest).filter(
        PointOfInterest.tour_id == tour_id
    ).order_by(PointOfInterest.order_in_tour).all()

    return pois

@router.get("/pois/{poi_id}", response_model=POIResponse)
def get_poi_content(
    poi_id: str,
    db: Session = Depends(get_db)
):
    """
    Get detailed POI content - this is the endpoint accessed by QR codes.
    """
    poi = db.query(PointOfInterest).filter(PointOfInterest.id == poi_id).first()
    if not poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not found"
        )

    # Check if the tour is published
    tour = db.query(Tour).filter(Tour.id == poi.tour_id).first()
    if not tour or not tour.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="POI not available"
        )

    return poi