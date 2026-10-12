from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User, Booking, TravelPackage
from dependencies import get_current_admin

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    total_users = db.query(User).count()

    total_bookings = db.query(Booking).count()

    total_packages = db.query(TravelPackage).count()

    confirmed_bookings = (
        db.query(Booking)
        .filter(Booking.status == "CONFIRMED")
        .count()
    )

    cancelled_bookings = (
        db.query(Booking)
        .filter(Booking.status == "CANCELLED")
        .count()
    )

    completed_bookings = (
        db.query(Booking)
        .filter(Booking.status == "COMPLETED")
        .count()
    )

    total_revenue = 0

    confirmed = (
        db.query(Booking)
        .filter(Booking.status == "CONFIRMED")
        .all()
    )

    for booking in confirmed:
        total_revenue += booking.total_amount

    return {
        "totalUsers": total_users,
        "totalBookings": total_bookings,
        "totalPackages": total_packages,
        "confirmedBookings": confirmed_bookings,
        "cancelledBookings": cancelled_bookings,
        "completedBookings": completed_bookings,
        "totalRevenue": total_revenue
    }