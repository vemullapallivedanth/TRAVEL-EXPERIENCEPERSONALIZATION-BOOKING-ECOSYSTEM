from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Transportation,
    TransportationBooking,
    User
)
from schemas import TransportationBookingCreate
from dependencies import get_current_user

router = APIRouter(
    prefix="/transportation-bookings",
    tags=["Transportation Bookings"]
)


@router.post("/")
def create_transportation_booking(
    data: TransportationBookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if data.numberOfTravellers <= 0:
        raise HTTPException(
            status_code=400,
            detail="Number of travellers must be at least 1"
        )

    transportation = (
        db.query(Transportation)
        .filter(
            Transportation.id == data.transportationId
        )
        .first()
    )

    if not transportation:
        raise HTTPException(
            status_code=404,
            detail="Transportation not found"
        )

    total_amount = (
        transportation.price *
        data.numberOfTravellers
    )

    booking = TransportationBooking(
        user_id=current_user.id,
        transportation_id=transportation.id,
        number_of_travellers=data.numberOfTravellers,
        total_amount=total_amount,
        status="CONFIRMED"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "message": "Transportation booked successfully",
        "booking": {
            "id": booking.id,
            "transportationId": transportation.id,
            "provider": transportation.provider,
            "source": transportation.source,
            "destination": transportation.destination,
            "numberOfTravellers": booking.number_of_travellers,
            "totalAmount": booking.total_amount,
            "status": booking.status,
            "bookingDate": booking.booking_date
        }
    }


@router.get("/my")
def get_my_transportation_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    bookings = (
        db.query(TransportationBooking)
        .filter(
            TransportationBooking.user_id ==
            current_user.id
        )
        .all()
    )

    result = []

    for booking in bookings:

        transport = booking.transportation

        result.append({
            "id": booking.id,
            "provider": transport.provider,
            "type": transport.type,
            "source": transport.source,
            "destination": transport.destination,
            "departureTime": transport.departure_time,
            "arrivalTime": transport.arrival_time,
            "numberOfTravellers":
                booking.number_of_travellers,
            "totalAmount":
                booking.total_amount,
            "status":
                booking.status,
            "bookingDate":
                booking.booking_date
        })

    return result


@router.put("/{booking_id}/cancel")
def cancel_transportation_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    booking = (
        db.query(TransportationBooking)
        .filter(
            TransportationBooking.id == booking_id,
            TransportationBooking.user_id ==
            current_user.id
        )
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Transportation booking not found"
        )

    if booking.status == "CANCELLED":
        raise HTTPException(
            status_code=400,
            detail="Booking already cancelled"
        )

    booking.status = "CANCELLED"

    db.commit()
    db.refresh(booking)

    return {
        "message":
            "Transportation booking cancelled successfully",
        "bookingId": booking.id,
        "status": booking.status
    }


@router.get("/")
def get_all_transportation_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    bookings = (
        db.query(TransportationBooking)
        .all()
    )

    result = []

    for booking in bookings:

        transport = booking.transportation

        result.append({
            "id": booking.id,
            "userId": booking.user_id,
            "provider": transport.provider,
            "type": transport.type,
            "source": transport.source,
            "destination": transport.destination,
            "numberOfTravellers":
                booking.number_of_travellers,
            "totalAmount":
                booking.total_amount,
            "status":
                booking.status,
            "bookingDate":
                booking.booking_date
        })

    return result