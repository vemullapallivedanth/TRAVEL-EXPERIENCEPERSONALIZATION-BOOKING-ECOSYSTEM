from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import TravelPackage
from schemas import PackageCreate
from dependencies import get_current_admin

router = APIRouter(
    prefix="/packages",
    tags=["Travel Packages"]
)


@router.get("/")
def get_packages(db: Session = Depends(get_db)):
    return db.query(TravelPackage).all()


@router.get("/{package_id}")
def get_package(
    package_id: int,
    db: Session = Depends(get_db)
):
    package = (
        db.query(TravelPackage)
        .filter(TravelPackage.id == package_id)
        .first()
    )

    if not package:
        raise HTTPException(
            status_code=404,
            detail="Travel package not found"
        )

    return package


@router.get("/destination/{destination}")
def get_packages_by_destination(
    destination: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(TravelPackage)
        .filter(TravelPackage.destination == destination)
        .all()
    )


@router.post("/")
def create_package(
    data: PackageCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    package = TravelPackage(
        package_name=data.packageName,
        destination=data.destination,
        duration=data.duration,
        price=data.price,
        hotel=data.hotel,
        activities=data.activities,
        itinerary=data.itinerary,
        available_seats=data.availableSeats
    )

    db.add(package)
    db.commit()
    db.refresh(package)

    return {
        "message": "Travel package created successfully",
        "package": package
    }


@router.put("/{package_id}")
def update_package(
    package_id: int,
    data: PackageCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    package = (
        db.query(TravelPackage)
        .filter(TravelPackage.id == package_id)
        .first()
    )

    if not package:
        raise HTTPException(
            status_code=404,
            detail="Travel package not found"
        )

    package.package_name = data.packageName
    package.destination = data.destination
    package.duration = data.duration
    package.price = data.price
    package.hotel = data.hotel
    package.activities = data.activities
    package.itinerary = data.itinerary
    package.available_seats = data.availableSeats

    db.commit()
    db.refresh(package)

    return {
        "message": "Travel package updated successfully",
        "package": package
    }


@router.delete("/{package_id}")
def delete_package(
    package_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    package = (
        db.query(TravelPackage)
        .filter(TravelPackage.id == package_id)
        .first()
    )

    if not package:
        raise HTTPException(
            status_code=404,
            detail="Travel package not found"
        )

    db.delete(package)
    db.commit()

    return {
        "message": "Travel package deleted successfully"
    }