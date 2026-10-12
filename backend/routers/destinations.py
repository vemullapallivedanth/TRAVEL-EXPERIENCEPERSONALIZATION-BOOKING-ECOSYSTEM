from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Destination
from schemas import DestinationCreate
from dependencies import get_current_admin

router = APIRouter(
    prefix="/destinations",
    tags=["Destinations"]
)


# Get all destinations
@router.get("/")
def get_destinations(db: Session = Depends(get_db)):
    destinations = db.query(Destination).all()

    return destinations


# Get destination by ID
@router.get("/{destination_id}")
def get_destination(
    destination_id: int,
    db: Session = Depends(get_db)
):
    destination = (
        db.query(Destination)
        .filter(Destination.id == destination_id)
        .first()
    )

    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found"
        )

    return destination


# Add destination - Admin only
@router.post("/")
def create_destination(
    data: DestinationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    destination = Destination(
        name=data.name,
        state=data.state,
        country=data.country,
        description=data.description,
        category=data.category,
        average_budget=data.averageBudget
    )

    db.add(destination)
    db.commit()
    db.refresh(destination)

    return {
        "message": "Destination created successfully",
        "destination": destination
    }


# Update destination - Admin only
@router.put("/{destination_id}")
def update_destination(
    destination_id: int,
    data: DestinationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    destination = (
        db.query(Destination)
        .filter(Destination.id == destination_id)
        .first()
    )

    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found"
        )

    destination.name = data.name
    destination.state = data.state
    destination.country = data.country
    destination.description = data.description
    destination.category = data.category
    destination.average_budget = data.averageBudget

    db.commit()
    db.refresh(destination)

    return {
        "message": "Destination updated successfully",
        "destination": destination
    }


# Delete destination - Admin only
@router.delete("/{destination_id}")
def delete_destination(
    destination_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    destination = (
        db.query(Destination)
        .filter(Destination.id == destination_id)
        .first()
    )

    if not destination:
        raise HTTPException(
            status_code=404,
            detail="Destination not found"
        )

    db.delete(destination)
    db.commit()

    return {
        "message": "Destination deleted successfully"
    }