from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserRegister, LoginRequest
from auth import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# CONVERT USER TO RESPONSE
# ==========================================

def user_to_dict(user):

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "preferredDestination":
            user.preferred_destination,
        "budget": user.budget,
        "tripDuration":
            user.trip_duration,
        "interests": user.interests,
        "role": user.role
    }


# ==========================================
# REGISTER
# ==========================================

@router.post("/register")
def register(
    data: UserRegister,
    db: Session = Depends(get_db)
):

    # Check whether email already exists
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create new user
    user = User(

        name=data.name,

        email=data.email,

        phone=data.phone,

        password=hash_password(
            data.password
        ),

        preferred_destination=
            data.preferredDestination,

        budget=data.budget or 0,

        trip_duration=
            data.tripDuration or 1,

        interests=data.interests,

        # IMPORTANT:
        # Public registration can only
        # create normal users.
        role="USER"
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return {
        "message": "Registration successful"
    }


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    # Find user by email
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        data.password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT token
    token = create_access_token(
        user.email
    )

    return {
        "token": token,
        "user": user_to_dict(user)
    }