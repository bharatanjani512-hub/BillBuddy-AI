from fastapi import APIRouter, Depends

from app.database.connection import database
from app.dependencies.auth import get_current_user

router = APIRouter()

bills_collection = database["bills"]


# ==========================
# Dashboard Summary
# ==========================
@router.get("/summary")
def get_summary(
    current_user: dict = Depends(get_current_user)
):

    user_email = current_user["sub"]

    bills = list(
        bills_collection.find(
            {"user_email": user_email}
        )
    )

    total_transactions = len(bills)

    total_expense = sum(
        bill["amount"] for bill in bills
    )

    return {
        "total_transactions": total_transactions,
        "total_expense": total_expense
    }


# ==========================
# Monthly Expense
# ==========================
@router.get("/monthly")
def monthly_expense(
    month: str,
    current_user: dict = Depends(get_current_user)
):

    user_email = current_user["sub"]

    bills = bills_collection.find(
        {
            "user_email": user_email,
            "date": {
                "$regex": f"^{month}"
            }
        }
    )

    total = sum(
        bill["amount"] for bill in bills
    )

    return {
        "month": month,
        "monthly_expense": total
    }


# ==========================
# Category Summary
# ==========================
@router.get("/category-summary")
def category_summary(
    current_user: dict = Depends(get_current_user)
):

    user_email = current_user["sub"]

    pipeline = [
        {
            "$match": {
                "user_email": user_email
            }
        },
        {
            "$group": {
                "_id": "$category",
                "total": {
                    "$sum": "$amount"
                }
            }
        }
    ]

    result = list(
        bills_collection.aggregate(pipeline)
    )

    summary = []

    for item in result:
        summary.append(
            {
                "category": item["_id"],
                "total": item["total"]
            }
        )

    return summary


# ==========================
# Recent Transactions
# ==========================
@router.get("/recent-transactions")
def recent_transactions(
    current_user: dict = Depends(get_current_user)
):

    user_email = current_user["sub"]

    bills = []

    cursor = bills_collection.find(
        {
            "user_email": user_email
        }
    ).sort(
        "date",
        -1
    ).limit(5)

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        bills.append(bill)

    return bills

# ==========================
# Search Bills
# ==========================
@router.get("/search")
def search_bills(
    query: str,
    current_user: dict = Depends(get_current_user)
):

    user_email = current_user["sub"]

    bills = []

    cursor = bills_collection.find(
        {
            "user_email": user_email,
            "$or": [
                {
                    "title": {
                        "$regex": query,
                        "$options": "i"
                    }
                },
                {
                    "merchant": {
                        "$regex": query,
                        "$options": "i"
                    }
                },
                {
                    "category": {
                        "$regex": query,
                        "$options": "i"
                    }
                }
            ]
        }
    )

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        bills.append(bill)

    return bills


# ==========================
# Filter Bills By Date
# ==========================
@router.get("/filter")
def filter_bills(
    start_date: str,
    end_date: str,
    current_user: dict = Depends(get_current_user)
):

    user_email = current_user["sub"]

    bills = []

    cursor = bills_collection.find(
        {
            "user_email": user_email,
            "date": {
                "$gte": start_date,
                "$lte": end_date
            }
        }
    )

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        bills.append(bill)

    return bills


# ==========================
# Filter Bills By Payment Mode
# ==========================
@router.get("/payment-mode")
def payment_mode(
    mode: str,
    current_user: dict = Depends(get_current_user)
):

    user_email = current_user["sub"]

    bills = []

    cursor = bills_collection.find(
        {
            "user_email": user_email,
            "payment_mode": mode
        }
    )

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        bills.append(bill)

    return bills