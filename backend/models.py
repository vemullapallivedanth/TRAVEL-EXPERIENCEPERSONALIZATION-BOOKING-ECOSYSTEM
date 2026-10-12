from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from database import Base


# ==========================================
# USER
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    phone = Column(
        String,
        nullable=True
    )

    password = Column(
        String,
        nullable=False
    )

    preferred_destination = Column(
        String,
        nullable=True
    )

    budget = Column(
        Float,
        default=0
    )

    trip_duration = Column(
        Integer,
        default=1
    )

    interests = Column(
        String,
        nullable=True
    )

    role = Column(
        String,
        default="USER"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    bookings = relationship(
        "Booking",
        back_populates="user"
    )


# ==========================================
# DESTINATION
# ==========================================

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    state = Column(
        String,
        nullable=True
    )

    country = Column(
        String,
        default="India"
    )

    description = Column(
        String,
        nullable=True
    )

    category = Column(
        String,
        nullable=True
    )

    average_budget = Column(
        Float,
        default=0
    )


# ==========================================
# ACCOMMODATION
# ==========================================

class Accommodation(Base):
    __tablename__ = "accommodations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    destination = Column(
        String,
        nullable=False
    )

    type = Column(
        String,
        nullable=True
    )

    price_per_night = Column(
        Float,
        default=0
    )

    rating = Column(
        Float,
        default=0
    )

    facilities = Column(
        String,
        nullable=True
    )


# ==========================================
# TRANSPORTATION
# ==========================================

class Transportation(Base):
    __tablename__ = "transportation"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    type = Column(
        String,
        nullable=False
    )

    provider = Column(
        String,
        nullable=False
    )

    source = Column(
        String,
        nullable=False
    )

    destination = Column(
        String,
        nullable=False
    )

    price = Column(
        Float,
        default=0
    )

    departure_time = Column(
        String,
        nullable=True
    )

    arrival_time = Column(
        String,
        nullable=True
    )


# ==========================================
# TRAVEL PACKAGE
# ==========================================

class TravelPackage(Base):
    __tablename__ = "travel_packages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    package_name = Column(
        String,
        nullable=False
    )

    destination = Column(
        String,
        nullable=False
    )

    duration = Column(
        Integer,
        nullable=False
    )

    price = Column(
        Float,
        nullable=False
    )

    hotel = Column(
        String,
        nullable=True
    )

    activities = Column(
        String,
        nullable=True
    )

    itinerary = Column(
        String,
        nullable=True
    )

    available_seats = Column(
        Integer,
        default=0
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    bookings = relationship(
        "Booking",
        back_populates="travel_package"
    )


# ==========================================
# PACKAGE BOOKING
# ==========================================

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    package_id = Column(
        Integer,
        ForeignKey("travel_packages.id"),
        nullable=False
    )

    number_of_travellers = Column(
        Integer,
        nullable=False
    )

    total_amount = Column(
        Float,
        nullable=False
    )

    booking_date = Column(
        DateTime,
        default=datetime.utcnow
    )

    status = Column(
        String,
        default="CONFIRMED"
    )

    user = relationship(
        "User",
        back_populates="bookings"
    )

    travel_package = relationship(
        "TravelPackage",
        back_populates="bookings"
    )


# ==========================================
# TRANSPORTATION BOOKING
# ==========================================

class TransportationBooking(Base):
    __tablename__ = "transportation_bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    transportation_id = Column(
        Integer,
        ForeignKey("transportation.id"),
        nullable=False
    )

    number_of_travellers = Column(
        Integer,
        nullable=False
    )

    total_amount = Column(
        Float,
        nullable=False
    )

    booking_date = Column(
        DateTime,
        default=datetime.utcnow
    )

    status = Column(
        String,
        default="CONFIRMED"
    )

    user = relationship(
        "User"
    )

    transportation = relationship(
        "Transportation"
    )