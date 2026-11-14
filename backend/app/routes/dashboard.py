from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user

from app.database.connection import database

from app.services.dashboard_service import (
    get_dashboard_summary,
    get_monthly_chart,
    get_category_chart,
    get_recent_transactions,
)

router = APIRouter()

bills_collection = database["bills"]


# =====================================
# Dashboard Summary
# =====================================
@router.get("/summary")
def dashboard_summary(
    current_user: dict = Depends(get_current_user)
):
    return get_dashboard_summary(
        current_user["sub"]
    )


# =====================================
# Monthly Expense Chart
# =====================================
@router.get("/monthly-chart")
def monthly_chart(
    current_user: dict = Depends(get_current_user)
):
    return get_monthly_chart(
        current_user["sub"]
    )


# =====================================
# Category Expense Chart
# =====================================
@router.get("/category-chart")
def category_chart(
    current_user: dict = Depends(get_current_user)
):
    return get_category_chart(
        current_user["sub"]
    )


# =====================================
# Recent Transactions
# =====================================
@router.get("/recent-transactions")
def recent_transactions(
    current_user: dict = Depends(get_current_user)
):
    return get_recent_transactions(
        current_user["sub"]
    )

# =====================================
# Search Bills
# =====================================
@router.get("/search")
def search_bills(
    query: str,
    current_user: dict = Depends(get_current_user)
):

    cursor = bills_collection.find(
        {
            "user_email": current_user["sub"],
            "$or": [
                {
                    "title": {
                        "$regex": query,
                        "$options": "i",
                    }
                },
                {
                    "merchant": {
                        "$regex": query,
                        "$options": "i",
                    }
                },
                {
                    "category": {
                        "$regex": query,
                        "$options": "i",
                    }
                },
            ],
        }
    )

    bills = []

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        bills.append(bill)

    return bills


# =====================================
# Filter Bills
# =====================================
@router.get("/filter")
def filter_bills(
    start_date: str,
    end_date: str,
    current_user: dict = Depends(get_current_user)
):

    cursor = bills_collection.find(
        {
            "user_email": current_user["sub"],
            "date": {
                "$gte": start_date,
                "$lte": end_date,
            },
        }
    )

    bills = []

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        bills.append(bill)

    return bills


# =====================================
# Filter Payment Mode
# =====================================
@router.get("/payment-mode")
def payment_mode(
    mode: str,
    current_user: dict = Depends(get_current_user)
):

    cursor = bills_collection.find(
        {
            "user_email": current_user["sub"],
            "payment_mode": mode,
        }
    )

    bills = []

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        bills.append(bill)

    return bills