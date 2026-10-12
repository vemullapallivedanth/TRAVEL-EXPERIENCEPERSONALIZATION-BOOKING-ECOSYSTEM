from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


# ==========================================
# USER REGISTRATION
# ==========================================

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    preferredDestination: Optional[str] = None
    budget: Optional[float] = 0
    tripDuration: Optional[int] = 1
    interests: Optional[str] = None


# ==========================================
# LOGIN
# ==========================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# USER RESPONSE
# ==========================================

class UserResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    name: str
    email: str
    phone: Optional[str] = None
    preferredDestination: Optional[str] = None
    budget: float
    tripDuration: int
    interests: Optional[str] = None
    role: str


# ==========================================
# LOGIN RESPONSE
# ==========================================

class LoginResponse(BaseModel):
    token: str
    user: UserResponse


# ==========================================
# DESTINATION
# ==========================================

class DestinationCreate(BaseModel):
    name: str
    state: Optional[str] = None
    country: str = "India"
    description: Optional[str] = None
    category: Optional[str] = None
    averageBudget: float = 0


# ==========================================
# ACCOMMODATION
# ==========================================

class AccommodationCreate(BaseModel):
    name: str
    destination: str
    type: Optional[str] = None
    pricePerNight: float = 0
    rating: float = 0
    facilities: Optional[str] = None


# ==========================================
# TRANSPORTATION
# ==========================================

class TransportationCreate(BaseModel):
    type: str
    provider: str
    source: str
    destination: str
    price: float = 0
    departureTime: Optional[str] = None
    arrivalTime: Optional[str] = None


# ==========================================
# TRANSPORTATION BOOKING
# ==========================================

class TransportationBookingCreate(BaseModel):
    transportationId: int
    numberOfTravellers: int


# ==========================================
# TRAVEL PACKAGE
# ==========================================

class PackageCreate(BaseModel):
    packageName: str
    destination: str
    duration: int
    price: float
    hotel: Optional[str] = None
    activities: Optional[str] = None
    itinerary: Optional[str] = None
    availableSeats: int = 0


# ==========================================
# BOOKING
# ==========================================

class BookingCreate(BaseModel):
    packageId: int
    numberOfTravellers: int


# ==========================================
# BOOKING RESPONSE
# ==========================================

class BookingResponse(BaseModel):
    id: int
    numberOfTravellers: int
    totalAmount: float
    status: str
    bookingDate: str
    travelPackage: dict