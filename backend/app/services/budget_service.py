from datetime import datetime

from bson import ObjectId
from pymongo import DESCENDING, ASCENDING

from app.database.connection import database
from app.responses.api_response import success_response

budget_collection = database["budgets"]
bill_collection = database["bills"]


# =====================================
# Utility
# =====================================

def serialize_budget(budget):
    if not budget:
        return None
    budget["_id"] = str(budget["_id"])
    budget.pop("user_email", None)
    return budget


# =====================================
# Save / Update Monthly Budget (legacy – used by dashboard/insights)
# =====================================

def save_budget(
    user_email: str,
    monthly_budget: float,
    currency: str = "INR",
):
    budget_collection.update_one(
        {"user_email": user_email, "is_global": True},
        {
            "$set": {
                "monthly_budget": monthly_budget,
                "currency": currency,
                "is_global": True,
                "updated_at": datetime.utcnow(),
            }
        },
        upsert=True,
    )


# =====================================
# Get Budget (legacy – used by dashboard/insights)
# =====================================

def get_budget(user_email: str):
    budget = budget_collection.find_one(
        {"user_email": user_email, "is_global": True},
        {"_id": 0},
    )
    return budget


# =====================================
# Get Raw Budget (legacy – used by dashboard)
# =====================================

def get_raw_budget(user_email: str):
    return budget_collection.find_one(
        {"user_email": user_email, "is_global": True}
    )


# =====================================
# Current Month Expense (legacy – used by dashboard/insights)
# =====================================

def get_current_month_expense(user_email: str):
    today = datetime.today()
    total = 0
    bills = bill_collection.find({"user_email": user_email})
    for bill in bills:
        try:
            bill_date = datetime.strptime(bill["date"], "%Y-%m-%d")
            if bill_date.month == today.month and bill_date.year == today.year:
                total += float(bill["amount"])
        except Exception:
            continue
    return round(total, 2)


# =====================================
# Create Budget Entry (per-category)
# =====================================

def create_budget_service(user_email: str, budget_data: dict):
    budget_data["user_email"] = user_email
    budget_data["is_global"] = False
    budget_data["created_at"] = datetime.utcnow()
    result = budget_collection.insert_one(budget_data)
    return success_response(
        message="Budget created successfully",
        data={"budget_id": str(result.inserted_id)},
    )


# =====================================
# List Budgets (paginated, per-category)
# =====================================

def get_budgets_service(
    user_email: str,
    page: int = 1,
    limit: int = 10,
    category: str = None,
    month: int = None,
    year: int = None,
    sort: str = "latest",
):
    query = {"user_email": user_email, "is_global": {"$ne": True}}

    if category:
        query["category"] = category
    if month:
        query["month"] = month
    if year:
        query["year"] = year

    sort_field = "created_at"
    sort_order = DESCENDING
    if sort == "oldest":
        sort_order = ASCENDING
    elif sort == "highest":
        sort_field = "amount"
        sort_order = DESCENDING
    elif sort == "lowest":
        sort_field = "amount"
        sort_order = ASCENDING

    total_records = budget_collection.count_documents(query)
    skip = (page - 1) * limit

    cursor = (
        budget_collection
        .find(query)
        .sort(sort_field, sort_order)
        .skip(skip)
        .limit(limit)
    )

    budgets = [serialize_budget(b) for b in cursor]
    total_pages = (total_records + limit - 1) // limit

    return success_response(
        message="Budgets fetched successfully",
        data={
            "budgets": budgets,
            "pagination": {
                "page": page,
                "limit": limit,
                "total_records": total_records,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1,
            },
        },
    )


# =====================================
# Budget Statistics
# =====================================

def get_budget_statistics_service(user_email: str):
    today = datetime.today()

    # All per-category budgets
    budgets = list(budget_collection.find(
        {"user_email": user_email, "is_global": {"$ne": True}}
    ))

    total_budget = sum(float(b.get("amount", 0)) for b in budgets)
    categories = {b.get("category") for b in budgets if b.get("category")}
    categories_count = len(categories)

    # Sum bills this month per category
    bills = list(bill_collection.find({"user_email": user_email}))
    category_spent = {}
    for bill in bills:
        try:
            bill_date = datetime.strptime(bill["date"], "%Y-%m-%d")
            if bill_date.month == today.month and bill_date.year == today.year:
                cat = bill.get("category", "Other")
                category_spent[cat] = category_spent.get(cat, 0) + float(bill.get("amount", 0))
        except Exception:
            continue

    total_spent = round(sum(category_spent.values()), 2)

    # Over-budget count: categories where spent > budget amount
    over_budget_count = 0
    for b in budgets:
        cat = b.get("category")
        if cat and category_spent.get(cat, 0) > float(b.get("amount", 0)):
            over_budget_count += 1

    return success_response(
        message="Budget statistics fetched",
        data={
            "total_budget": round(total_budget, 2),
            "total_spent": total_spent,
            "categories_count": categories_count,
            "over_budget_count": over_budget_count,
        },
    )


# =====================================
# Recent Budgets
# =====================================

def get_recent_budgets_service(user_email: str):
    cursor = (
        budget_collection
        .find({"user_email": user_email, "is_global": {"$ne": True}})
        .sort("created_at", DESCENDING)
        .limit(5)
    )
    budgets = [serialize_budget(b) for b in cursor]
    return success_response(message="Recent budgets fetched", data=budgets)


# =====================================
# Update Budget
# =====================================

def update_budget_service(user_email: str, budget_id: str, budget_data: dict):
    try:
        existing = budget_collection.find_one(
            {"_id": ObjectId(budget_id), "user_email": user_email, "is_global": {"$ne": True}}
        )
    except Exception:
        return None

    if not existing:
        return None

    budget_data["updated_at"] = datetime.utcnow()
    budget_collection.update_one(
        {"_id": ObjectId(budget_id)},
        {"$set": budget_data},
    )
    return success_response(message="Budget updated successfully")


# =====================================
# Delete Budget
# =====================================

def delete_budget_service(user_email: str, budget_id: str):
    try:
        existing = budget_collection.find_one(
            {"_id": ObjectId(budget_id), "user_email": user_email, "is_global": {"$ne": True}}
        )
    except Exception:
        return None

    if not existing:
        return None

    budget_collection.delete_one({"_id": ObjectId(budget_id)})
    return success_response(message="Budget deleted successfully")
