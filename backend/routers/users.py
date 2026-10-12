from fastapi import APIRouter, Depends

from dependencies import get_current_user
from models import User


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ==========================================
# GET CURRENT USER PROFILE
# ==========================================

@router.get("/me")
def get_my_profile(
    current_user: User = Depends(
        get_current_user
    )
):

    return {
        "id": current_user.id,

        "name": current_user.name,

        "email": current_user.email,

        "phone": current_user.phone,

        "preferredDestination":
            current_user.preferred_destination,

        "budget": current_user.budget,

        "tripDuration":
            current_user.trip_duration,

        "interests":
            current_user.interests,

        "role":
            current_user.role
    }