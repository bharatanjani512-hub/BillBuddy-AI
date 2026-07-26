from pathlib import Path

import pandas as pd

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app.database.connection import database
from app.utils.security import (
    verify_access_token,
    oauth2_scheme,
)

router = APIRouter()

bills_collection = database["bills"]

# ==========================
# Export Bills as CSV
# ==========================
@router.get("/csv")
def export_csv(
    token: str = Depends(oauth2_scheme)
):

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    user_email = payload["sub"]

    bills = list(
        bills_collection.find(
            {
                "user_email": user_email
            },
            {
                "_id": 0,
                "user_email": 0
            }
        )
    )
    if not bills:
        raise HTTPException(
            status_code=404,
            detail="No bills found."
        )
    df = pd.DataFrame(bills)

    # Create exports directory if it doesn't exist
    export_dir = Path("exports")
    export_dir.mkdir(exist_ok=True)

    # Create CSV file path
    file_path = export_dir / "my_expenses.csv"

    # Save DataFrame as CSV
    df.to_csv(file_path, index=False)

    return FileResponse(
        path=file_path,
        filename="my_expenses.csv",
        media_type="text/csv"
    )