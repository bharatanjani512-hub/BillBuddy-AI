from fastapi import APIRouter, Depends

from app.database.connection import database
from app.services.financial_insight_service import (
    generate_financial_insights,
)
from app.utils.jwt_handler import verify_token


router = APIRouter(
    prefix="/financial-insights",
    tags=["Financial Insights"]
)

bills_collection = database["bills"]


@router.get("/")
def get_financial_insights(
    payload: dict = Depends(verify_token)
):
    """
    Returns personalized financial insights
    for the logged-in user.
    """

    user_email = payload["sub"]

    bills = list(
        bills_collection.find(
            {
                "user_email": user_email
            },
            {
                "_id": 0
            }
        )
    )

    return generate_financial_insights(bills)