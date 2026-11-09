from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from backend.core.config import settings

password_hash = PasswordHash.recommended()


def verify_password(plain_password: str) -> bool:
    return password_hash.verify(
        plain_password,
        settings.ADMIN_PASSWORD_HASH
    )


def create_access_token():
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return jwt.encode(
        {
            "sub": settings.ADMIN_USERNAME,
            "exp": expires,
        },
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str):
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )