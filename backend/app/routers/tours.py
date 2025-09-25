from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from app.db.database import get_db
from app.core.auth import get_current_active_user, require_roles
from app.models.user import User, UserRole
from app.models.tour import Tour
from app.schemas.tour import TourCreate, TourUpdate, TourResponse, TourListResponse

router = APIRouter(prefix="/tours", tags=["tours"])

@router.post("/", response_model=TourResponse)
def create_tour(
    tour: TourCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    db_tour = Tour(
        **tour.dict(),
        guide_id=current_user.id
    )
    db.add(db_tour)
    db.commit()
    db.refresh(db_tour)
    return db_tour

@router.get("/my-tours", response_model=List[TourResponse])
def get_my_tours(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    tours = db.query(Tour).filter(Tour.guide_id == current_user.id).all()
    return tours

@router.put("/{tour_id}", response_model=TourResponse)
def update_tour(
    tour_id: str,
    tour_update: TourUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    # Check ownership (admins can edit any tour)
    if current_user.role != UserRole.ADMIN and tour.guide_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit this tour"
        )

    # Update fields
    update_data = tour_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tour, field, value)

    db.commit()
    db.refresh(tour)
    return tour

@router.delete("/{tour_id}")
def delete_tour(
    tour_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.GUIDE, UserRole.ADMIN]))
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    # Check ownership (admins can delete any tour)
    if current_user.role != UserRole.ADMIN and tour.guide_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this tour"
        )

    db.delete(tour)
    db.commit()
    return {"message": "Tour deleted successfully"}

# Public endpoints for visitors
@router.get("/", response_model=List[TourListResponse])
def list_published_tours(
    city: Optional[str] = Query(None, description="Filter by city"),
    country: Optional[str] = Query(None, description="Filter by country"),
    guide_id: Optional[str] = Query(None, description="Filter by guide ID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search_query: Optional[str] = Query(None, description="Search in title and description"),
    sort_by: Optional[str] = Query("created_at", description="Sort by: created_at, average_rating"),
    order: Optional[str] = Query("desc", description="Order: asc, desc"),
    db: Session = Depends(get_db)
):
    query = db.query(Tour).filter(Tour.is_published == True)

    # Apply filters
    if city:
        query = query.filter(Tour.city.ilike(f"%{city}%"))
    if country:
        query = query.filter(Tour.country.ilike(f"%{country}%"))
    if guide_id:
        query = query.filter(Tour.guide_id == guide_id)
    if category:
        query = query.filter(Tour.category.ilike(f"%{category}%"))
    if search_query:
        query = query.filter(
            Tour.title.ilike(f"%{search_query}%") |
            Tour.description.ilike(f"%{search_query}%")
        )

    # Apply sorting
    if sort_by == "average_rating":
        order_func = desc if order == "desc" else asc
        query = query.order_by(order_func(Tour.average_rating))
    else:  # Default to created_at
        order_func = desc if order == "desc" else asc
        query = query.order_by(order_func(Tour.created_at))

    tours = query.all()

    # Transform to include guide username
    result = []
    for tour in tours:
        guide = db.query(User).filter(User.id == tour.guide_id).first()
        tour_dict = {
            "id": str(tour.id),
            "title": tour.title,
            "description": tour.description,
            "city": tour.city,
            "country": tour.country,
            "category": tour.category,
            "duration_minutes": tour.duration_minutes,
            "average_rating": tour.average_rating,
            "total_ratings": tour.total_ratings,
            "guide_username": guide.username if guide else "Unknown"
        }
        result.append(TourListResponse(**tour_dict))

    return result

@router.get("/{tour_id}", response_model=TourResponse)
def get_tour_details(
    tour_id: str,
    db: Session = Depends(get_db)
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    # Only return published tours for non-owners
    if not tour.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    return tour

# Admin-only endpoints
@router.get("/admin/all", response_model=List[TourResponse])
def list_all_tours_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    tours = db.query(Tour).all()
    return tours

@router.put("/{tour_id}/publish", response_model=TourResponse)
def toggle_tour_publish_status(
    tour_id: str,
    is_published: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.ADMIN]))
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    tour.is_published = is_published
    db.commit()
    db.refresh(tour)
    return tour