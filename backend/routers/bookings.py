from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Booking, TravelPackage, User
from schemas import BookingCreate
from dependencies import get_current_user, get_current_admin

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


# Create booking
@router.post("/")
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.numberOfTravellers <= 0:
        raise HTTPException(
            status_code=400,
            detail="Number of travellers must be at least 1"
        )

    package = (
        db.query(TravelPackage)
        .filter(TravelPackage.id == data.packageId)
        .first()
    )

    if not package:
        raise HTTPException(
            status_code=404,
            detail="Travel package not found"
        )

    if package.available_seats < data.numberOfTravellers:
        raise HTTPException(
            status_code=400,
            detail="Not enough seats available"
        )

    total_amount = package.price * data.numberOfTravellers

    booking = Booking(
        user_id=current_user.id,
        package_id=package.id,
        number_of_travellers=data.numberOfTravellers,
        total_amount=total_amount,
        booking_date=datetime.utcnow(),
        status="CONFIRMED"
    )

    package.available_seats -= data.numberOfTravellers

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "message": "Booking confirmed successfully",
        "bookingId": booking.id,
        "package": package.package_name,
        "travellers": booking.number_of_travellers,
        "totalAmount": booking.total_amount,
        "status": booking.status
    }


# Get user's bookings
@router.get("/my")
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .all()
    )

    result = []

    for booking in bookings:
        result.append({
            "id": booking.id,
            "numberOfTravellers": booking.number_of_travellers,
            "totalAmount": booking.total_amount,
            "status": booking.status,
            "bookingDate": str(booking.booking_date),
            "travelPackage": {
                "id": booking.travel_package.id,
                "packageName": booking.travel_package.package_name,
                "destination": booking.travel_package.destination,
                "duration": booking.travel_package.duration,
                "price": booking.travel_package.price
            }
        })

    return result


# Admin: get all bookings
@router.get("/")
def get_all_bookings(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    bookings = db.query(Booking).all()

    result = []

    for booking in bookings:
        result.append({
            "id": booking.id,
            "user": {
                "id": booking.user.id,
                "name": booking.user.name,
                "email": booking.user.email
            },
            "travelPackage": {
                "id": booking.travel_package.id,
                "packageName": booking.travel_package.package_name,
                "destination": booking.travel_package.destination
            },
            "numberOfTravellers": booking.number_of_travellers,
            "totalAmount": booking.total_amount,
            "status": booking.status,
            "bookingDate": str(booking.booking_date)
        })

    return result


# Cancel booking
@router.put("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="You cannot cancel this booking"
        )

    if booking.status == "CANCELLED":
        raise HTTPException(
            status_code=400,
            detail="Booking is already cancelled"
        )

    booking.status = "CANCELLED"

    package = booking.travel_package
    package.available_seats += booking.number_of_travellers

    db.commit()

    return {
        "message": "Booking cancelled successfully"
    }