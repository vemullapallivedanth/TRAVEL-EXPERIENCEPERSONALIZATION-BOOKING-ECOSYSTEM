from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models

from database import engine, SessionLocal
from auth import hash_password

from routers import (
    auth,
    users,
    destinations,
    accommodations,
    transportation,
    packages,
    bookings,
    transportation_bookings,
    recommendations,
    reports
)


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

models.Base.metadata.create_all(bind=engine)


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="TravelX Travel Management API",
    description="Travel Experience Personalization and Booking Ecosystem",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==========================================
# API ROUTERS
# ==========================================

app.include_router(
    auth.router,
    prefix="/api"
)

app.include_router(
    users.router,
    prefix="/api"
)

app.include_router(
    destinations.router,
    prefix="/api"
)

app.include_router(
    accommodations.router,
    prefix="/api"
)

app.include_router(
    transportation.router,
    prefix="/api"
)

app.include_router(
    packages.router,
    prefix="/api"
)

app.include_router(
    bookings.router,
    prefix="/api"
)

app.include_router(
    transportation_bookings.router,
    prefix="/api"
)

app.include_router(
    recommendations.router,
    prefix="/api"
)

app.include_router(
    reports.router,
    prefix="/api"
)


# ==========================================
# DEFAULT ADMIN
# ==========================================

def create_default_admin():

    db: Session = SessionLocal()

    try:

        existing_admin = (
            db.query(models.User)
            .filter(
                models.User.email == "admin@travelx.com"
            )
            .first()
        )

        if not existing_admin:

            admin = models.User(
                name="TravelX Administrator",
                email="admin@travelx.com",
                phone="9999999999",
                password=hash_password("Admin@123"),
                preferred_destination=None,
                budget=0,
                trip_duration=1,
                interests=None,
                role="ADMIN"
            )

            db.add(admin)
            db.commit()

            print("Default admin created.")

    finally:

        db.close()


# ==========================================
# STARTUP
# ==========================================

@app.on_event("startup")
def startup_event():

    create_default_admin()


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():

    return {
        "message": "TravelX API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/api/health")
def health_check():

    return {
        "status": "success",
        "message": "TravelX backend is working"
    }