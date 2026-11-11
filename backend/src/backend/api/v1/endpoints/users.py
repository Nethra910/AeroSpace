from fastapi import APIRouter, Depends, HTTPException
import jwt
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.db.session import get_db
from backend.models.user import User
from backend.services.auth import create_user_access_token

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.services.auth import decode_user_access_token

router = APIRouter()

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    try:
        payload = decode_user_access_token(credentials.credentials)
        user_id = int(payload.get("sub"))

        user = db.query(User).filter(
            User.id == user_id,
            User.is_active == True
        ).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found or inactive",
            )

        return user

    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired user token",
        )

class GoogleAuthRequest(BaseModel):
    credential: str


@router.post("/google")
def google_login(
    data: GoogleAuthRequest,
    db: Session = Depends(get_db),
):
    try:
        google_user = id_token.verify_oauth2_token(
            data.credential,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token",
        )

    if not google_user.get("email_verified"):
        raise HTTPException(status_code=401, detail="Email not verified")

    google_id = google_user["sub"]

    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        user = User(
            google_id=google_id,
            name=google_user.get("name", ""),
            email=google_user["email"],
            profile_image=google_user.get("picture"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_user_access_token(
        user_id=user.id,
        email=user.email,
    )

    return {
        "message": "Google authentication successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "profile_image": user.profile_image,
        },
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "profile_image": current_user.profile_image,
    }