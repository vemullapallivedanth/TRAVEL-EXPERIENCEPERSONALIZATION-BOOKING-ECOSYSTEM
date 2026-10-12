from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Transportation
from schemas import TransportationCreate
from dependencies import get_current_admin


router = APIRouter(
    prefix="/transportation",
    tags=["Transportation"]
)


# ==========================================
# GET ALL TRANSPORTATION
# ==========================================

@router.get("/")
def get_transportation(
    db: Session = Depends(get_db)
):

    return db.query(
        Transportation
    ).all()


# ==========================================
# GET TRANSPORTATION BY ID
# ==========================================

@router.get("/{transportation_id}")
def get_transportation_by_id(
    transportation_id: int,
    db: Session = Depends(get_db)
):

    transportation = (
        db.query(Transportation)
        .filter(
            Transportation.id ==
            transportation_id
        )
        .first()
    )


    if not transportation:

        raise HTTPException(
            status_code=404,
            detail="Transportation not found"
        )


    return transportation


# ==========================================
# CREATE TRANSPORTATION
# ==========================================

@router.post("/")
def create_transportation(
    data: TransportationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):

    transportation = Transportation(

        type=data.type,

        provider=data.provider,

        source=data.source,

        destination=data.destination,

        price=data.price,

        departure_time=data.departureTime,

        arrival_time=data.arrivalTime

    )


    db.add(transportation)

    db.commit()

    db.refresh(transportation)


    return {

        "message":
            "Transportation created successfully",

        "transportation":
            transportation

    }


# ==========================================
# UPDATE TRANSPORTATION
# ==========================================

@router.put("/{transportation_id}")
def update_transportation(
    transportation_id: int,
    data: TransportationCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):

    transportation = (
        db.query(Transportation)
        .filter(
            Transportation.id ==
            transportation_id
        )
        .first()
    )


    if not transportation:

        raise HTTPException(
            status_code=404,
            detail="Transportation not found"
        )


    transportation.type = data.type

    transportation.provider = data.provider

    transportation.source = data.source

    transportation.destination = data.destination

    transportation.price = data.price

    transportation.departure_time = (
        data.departureTime
    )

    transportation.arrival_time = (
        data.arrivalTime
    )


    db.commit()

    db.refresh(transportation)


    return {

        "message":
            "Transportation updated successfully",

        "transportation":
            transportation

    }


# ==========================================
# DELETE TRANSPORTATION
# ==========================================

@router.delete("/{transportation_id}")
def delete_transportation(
    transportation_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):

    transportation = (
        db.query(Transportation)
        .filter(
            Transportation.id ==
            transportation_id
        )
        .first()
    )


    if not transportation:

        raise HTTPException(
            status_code=404,
            detail="Transportation not found"
        )


    db.delete(transportation)

    db.commit()


    return {

        "message":
            "Transportation deleted successfully"

    }