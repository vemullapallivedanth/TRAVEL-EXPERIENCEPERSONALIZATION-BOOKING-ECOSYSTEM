from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import TravelPackage, User
from dependencies import get_current_user

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


def calculate_score(user, package):
    score = 0

    # Destination preference
    if user.preferred_destination:
        if user.preferred_destination.lower() == package.destination.lower():
            score += 50

    # Trip duration
    if user.trip_duration:
        difference = abs(user.trip_duration - package.duration)

        if difference == 0:
            score += 30
        elif difference == 1:
            score += 20
        elif difference == 2:
            score += 10

    # Budget
    if user.budget and package.price <= user.budget:
        score += 20

    # Interest matching
    if user.interests and package.activities:
        interests = [
            item.strip().lower()
            for item in user.interests.split(",")
        ]

        activities = package.activities.lower()

        for interest in interests:
            if interest and interest in activities:
                score += 15

    return score


@router.get("/")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    packages = db.query(TravelPackage).all()

    recommendations = []

    for package in packages:
        score = calculate_score(
            current_user,
            package
        )

        recommendations.append({
            "id": package.id,
            "packageName": package.package_name,
            "destination": package.destination,
            "duration": package.duration,
            "price": package.price,
            "hotel": package.hotel,
            "activities": package.activities,
            "itinerary": package.itinerary,
            "availableSeats": package.available_seats,
            "score": score
        })

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return recommendations[:5]