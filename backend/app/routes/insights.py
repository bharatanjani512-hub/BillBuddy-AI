from fastapi import APIRouter, Depends, HTTPException

from app.database.connection import database
from app.utils.security import (
    verify_access_token,
    oauth2_scheme,
)

from app.services.analytics_service import (
    generate_statistics
)

from app.services.ai_service import (
    generate_ai_insights
)

router = APIRouter()

bills_collection = database["bills"]


# ==========================
# AI Expense Insights
# ==========================

@router.get("/")
def get_insights(
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

    # ==========================
    # Analytics Service
    # ==========================

    analytics = generate_statistics(
        bills
    )

    # ==========================
    # AI Service
    # ==========================

    ai_insights = generate_ai_insights(
        analytics["statistics"]
    )

    return {
        "statistics": analytics["statistics"],
        "rule_based_insights": analytics["insights"],
        "ai_insights": ai_insights
    }