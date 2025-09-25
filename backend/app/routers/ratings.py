from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.database import get_db
from app.core.auth import get_current_active_user, require_roles
from app.models.user import User, UserRole
from app.models.tour import Tour
from app.models.rating import Rating
from app.schemas.rating import RatingCreate, RatingResponse

router = APIRouter(tags=["ratings"])

@router.post("/tours/{tour_id}/ratings", response_model=RatingResponse)
def create_rating(
    tour_id: str,
    rating_data: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.VISITOR, UserRole.GUIDE, UserRole.ADMIN]))
):
    """Submit a rating for a tour"""

    # Check if tour exists and is published
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found"
        )

    if not tour.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not available for rating"
        )

    # Check if user is the guide of this tour
    if tour.guide_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot rate your own tour"
        )

    # Validate rating value
    if rating_data.rating < 1 or rating_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )

    # Check if user already rated this tour
    existing_rating = db.query(Rating).filter(
        Rating.tour_id == tour_id,
        Rating.user_id == current_user.id
    ).first()

    if existing_rating:
        # Update existing rating
        existing_rating.rating = rating_data.rating
        existing_rating.comment = rating_data.comment
        db.commit()
        db.refresh(existing_rating)
        rating = existing_rating
    else:
        # Create new rating
        rating = Rating(
            tour_id=tour_id,
            user_id=current_user.id,
            rating=rating_data.rating,
            comment=rating_data.comment
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)

    # Update tour's average rating and total ratings
    ratings_query = db.query(Rating).filter(Rating.tour_id == tour_id)
    total_ratings = ratings_query.count()
    average_rating = ratings_query.with_entities(func.avg(Rating.rating)).scalar()

    tour.total_ratings = total_ratings
    tour.average_rating = float(average_rating) if average_rating else 0.0
    db.commit()

    return rating

@router.get("/tours/{tour_id}/ratings", response_model=List[RatingResponse])
def get_tour_ratings(
    tour_id: str,
    db: Session = Depends(get_db)
):
    """Get all ratings for a tour"""

    # Check if tour exists and is published
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

    ratings = db.query(Rating).filter(Rating.tour_id == tour_id).all()
    return ratings

@router.get("/users/me/ratings", response_model=List[RatingResponse])
def get_my_ratings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all ratings submitted by current user"""
    ratings = db.query(Rating).filter(Rating.user_id == current_user.id).all()
    return ratings