from datetime import datetime, timedelta

import bcrypt
from jose import jwt


# ==========================================
# JWT SETTINGS
# ==========================================

SECRET_KEY = "TRAVELX_SECRET_KEY_CHANGE_THIS"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 120


# ==========================================
# PASSWORD HASHING
# ==========================================

def hash_password(password: str) -> str:

    hashed = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


# ==========================================
# PASSWORD VERIFICATION
# ==========================================

def verify_password(
    password: str,
    hashed_password: str
) -> bool:

    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


# ==========================================
# CREATE JWT TOKEN
# ==========================================

def create_access_token(email: str):

    expire = (
        datetime.utcnow()
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": email,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# ==========================================
# DECODE JWT TOKEN
# ==========================================

def decode_token(token: str):

    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )