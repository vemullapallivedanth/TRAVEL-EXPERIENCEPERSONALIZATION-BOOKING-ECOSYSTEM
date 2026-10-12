from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Accommodation
from schemas import AccommodationCreate
from dependencies import get_current_admin

router = APIRouter(
    prefix="/accommodations",
    tags=["Accommodations"]
)


@router.get("/")
def get_accommodations(db: Session = Depends(get_db)):
    return db.query(Accommodation).all()


@router.get("/{accommodation_id}")
def get_accommodation(
    accommodation_id: int,
    db: Session = Depends(get_db)
):
    accommodation = (
        db.query(Accommodation)
        .filter(Accommodation.id == accommodation_id)
        .first()
    )

    if not accommodation:
        raise HTTPException(
            status_code=404,
            detail="Accommodation not found"
        )

    return accommodation


@router.get("/destination/{destination}")
def get_by_destination(
    destination: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(Accommodation)
        .filter(Accommodation.destination == destination)
        .all()
    )


@router.post("/")
def create_accommodation(
    data: AccommodationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    accommodation = Accommodation(
        name=data.name,
        destination=data.destination,
        type=data.type,
        price_per_night=data.pricePerNight,
        rating=data.rating,
        facilities=data.facilities
    )

    db.add(accommodation)
    db.commit()
    db.refresh(accommodation)

    return {
        "message": "Accommodation created successfully",
        "accommodation": accommodation
    }


@router.put("/{accommodation_id}")
def update_accommodation(
    accommodation_id: int,
    data: AccommodationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    accommodation = (
        db.query(Accommodation)
        .filter(Accommodation.id == accommodation_id)
        .first()
    )

    if not accommodation:
        raise HTTPException(
            status_code=404,
            detail="Accommodation not found"
        )

    accommodation.name = data.name
    accommodation.destination = data.destination
    accommodation.type = data.type
    accommodation.price_per_night = data.pricePerNight
    accommodation.rating = data.rating
    accommodation.facilities = data.facilities

    db.commit()
    db.refresh(accommodation)

    return {
        "message": "Accommodation updated successfully",
        "accommodation": accommodation
    }


@router.delete("/{accommodation_id}")
def delete_accommodation(
    accommodation_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    accommodation = (
        db.query(Accommodation)
        .filter(Accommodation.id == accommodation_id)
        .first()
    )

    if not accommodation:
        raise HTTPException(
            status_code=404,
            detail="Accommodation not found"
        )

    db.delete(accommodation)
    db.commit()

    return {
        "message": "Accommodation deleted successfully"
    }