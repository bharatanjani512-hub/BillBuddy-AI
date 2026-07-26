from fastapi import Depends, HTTPException

from app.utils.security import (
    oauth2_scheme,
    verify_access_token,
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
):
    """
    Verifies the JWT token and returns the current user's payload.
    """

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    return payload