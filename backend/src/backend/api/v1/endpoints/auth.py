from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError

from backend.core.config import settings
from backend.services.auth import (
    verify_password,
    create_access_token,
    decode_access_token,
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_access_token(token)
        username = payload.get("sub")

        if username != settings.ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {"username": username}

    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    if (
        form.username != settings.ADMIN_USERNAME
        or not verify_password(form.password)
    ):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    return {
        "access_token": create_access_token(),
        "token_type": "bearer",
    }


@router.get("/me")
def get_me(admin: dict = Depends(get_current_admin)):
    return admin


@router.post("/logout")
def logout(admin: dict = Depends(get_current_admin)):
    return {"message": "Logged out successfully"}