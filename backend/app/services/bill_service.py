from bson import ObjectId
from pymongo import DESCENDING, ASCENDING
from app.database.connection import database
from app.responses.api_response import success_response

bills_collection = database["bills"]


# ============================================================
# Utility Functions
# ============================================================

def serialize_bill(bill):
    """
    Convert Mongo ObjectId to string and
    remove internal fields.
    """
    if not bill:
        return None

    bill["_id"] = str(bill["_id"])
    bill.pop("user_email", None)

    return bill


def get_bill_by_id_service(
    bill_id: str,
    user_email: str
):
    try:
        bill = bills_collection.find_one(
            {
                "_id": ObjectId(bill_id),
                "user_email": user_email,
            }
        )

        return serialize_bill(bill)

    except Exception:
        return None


# ============================================================
# Create Bill
# ============================================================

def create_bill_service(
    bill_data: dict,
    user_email: str
):
    bill_data["user_email"] = user_email
    if not bill_data.get("submitted_by"):
        bill_data["submitted_by"] = user_email

    # If charged to corporate wallet, deduct balance
    if bill_data.get("is_corporate") and bill_data.get("wallet_id"):
        from app.services.wallet_service import deduct_wallet_expense
        deduct_wallet_expense(
            wallet_id=bill_data["wallet_id"],
            amount=bill_data.get("amount", 0.0),
            bill_title=bill_data.get("title", "Expense"),
            user_email=user_email
        )

    result = bills_collection.insert_one(bill_data)

    return success_response(
        message="Bill Created Successfully",
        data={
            "bill_id": str(result.inserted_id)
        }
    )


# ============================================================
# Get Bills
# Supports:
# Pagination
# Search
# Category
# Payment Mode
# Amount
# Date
# Sorting
# ============================================================

def get_bills_service(
    user_email: str,
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    category: str | None = None,
    payment_mode: str | None = None,
    status: str | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
    from_date: str | None = None,
    to_date: str | None = None,
    sort: str = "latest",
    workspace_id: str | None = None,
):
    query = {
        "user_email": user_email
    }

    # -------------------------
    # Workspace Filter
    # -------------------------
    if workspace_id and workspace_id != "all":
        query["workspace_id"] = workspace_id

    # -------------------------
    # Status Filter
    # -------------------------
    if status and status.lower() != "all":
        query["status"] = {"$regex": f"^{status}$", "$options": "i"}

    # -------------------------
    # Search
    # -------------------------

    if search:
        query["$or"] = [
            {
                "title": {
                    "$regex": search,
                    "$options": "i",
                }
            },
            {
                "merchant": {
                    "$regex": search,
                    "$options": "i",
                }
            },
            {
                "category": {
                    "$regex": search,
                    "$options": "i",
                }
            },
            {
                "notes": {
                    "$regex": search,
                    "$options": "i",
                }
            },
        ]

    # -------------------------
    # Category
    # -------------------------

    if category:
        query["category"] = category

    # -------------------------
    # Payment Mode
    # -------------------------

    if payment_mode:
        query["payment_mode"] = payment_mode

    # -------------------------
    # Amount Filters
    # -------------------------

    if min_amount is not None or max_amount is not None:

        query["amount"] = {}

        if min_amount is not None:
            query["amount"]["$gte"] = min_amount

        if max_amount is not None:
            query["amount"]["$lte"] = max_amount

    # -------------------------
    # Date Filters
    # -------------------------

    if from_date or to_date:

        query["date"] = {}

        if from_date:
            query["date"]["$gte"] = from_date

        if to_date:
            query["date"]["$lte"] = to_date

    # -------------------------
    # Sorting
    # -------------------------

    sort_field = "_id"
    sort_order = DESCENDING

    if sort == "oldest":
        sort_order = ASCENDING

    elif sort == "highest":
        sort_field = "amount"
        sort_order = DESCENDING

    elif sort == "lowest":
        sort_field = "amount"
        sort_order = ASCENDING

    elif sort == "title_asc":
        sort_field = "title"
        sort_order = ASCENDING

    elif sort == "title_desc":
        sort_field = "title"
        sort_order = DESCENDING

    total_records = bills_collection.count_documents(query)

    skip = (page - 1) * limit

    cursor = (
        bills_collection
        .find(query)
        .sort(sort_field, sort_order)
        .skip(skip)
        .limit(limit)
    )
    bills = []

    total_expense = 0
    highest_expense = 0

    category_summary = {}

    payment_summary = {}

    for bill in cursor:

        bill = serialize_bill(bill)

        bills.append(bill)

        amount = float(bill["amount"])

        total_expense += amount

        if amount > highest_expense:
            highest_expense = amount

        # -------------------------
        # Category Statistics
        # -------------------------

        category = bill["category"]

        if category not in category_summary:
            category_summary[category] = 0

        category_summary[category] += amount

        # -------------------------
        # Payment Mode Statistics
        # -------------------------

        payment = bill["payment_mode"]

        if payment not in payment_summary:
            payment_summary[payment] = 0

        payment_summary[payment] += amount

    average_expense = 0

    if total_records > 0:
        average_expense = round(
            total_expense / total_records,
            2
        )

    total_pages = (
        total_records + limit - 1
    ) // limit

    return success_response(
        message="Bills fetched successfully",
        data={
            "bills": bills,

            "pagination": {
                "page": page,
                "limit": limit,
                "total_records": total_records,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1,
            },

            "statistics": {
                "total_bills": total_records,
                "total_expense": round(
                    total_expense,
                    2
                ),
                "highest_expense": highest_expense,
                "average_expense": average_expense,
            },

            "category_summary": category_summary,

            "payment_summary": payment_summary,
        },
    )


# ============================================================
# Update Bill
# ============================================================

def update_bill_service(
    bill_id: str,
    bill_data: dict,
    user_email: str,
):
    existing_bill = get_bill_by_id_service(
        bill_id,
        user_email,
    )

    if existing_bill is None:
        return None

    bill_data["user_email"] = user_email

    bills_collection.update_one(
        {
            "_id": ObjectId(bill_id)
        },
        {
            "$set": bill_data
        }
    )

    return success_response(
        message="Bill Updated Successfully"
    )


# ============================================================
# Delete Bill
# ============================================================

def delete_bill_service(
    bill_id: str,
    user_email: str,
):
    existing_bill = get_bill_by_id_service(
        bill_id,
        user_email,
    )

    if existing_bill is None:
        return None

    bills_collection.delete_one(
        {
            "_id": ObjectId(bill_id)
        }
    )

    return success_response(
        message="Bill Deleted Successfully"
    )
# ============================================================
# Recent Transactions
# ============================================================

def get_recent_transactions_service(
    user_email: str,
    limit: int = 5,
):
    recent_transactions = []

    cursor = (
        bills_collection
        .find(
            {"user_email": user_email}
        )
        .sort("_id", DESCENDING)
        .limit(limit)
    )

    for bill in cursor:
        recent_transactions.append(
            serialize_bill(bill)
        )

    return success_response(
        message="Recent transactions fetched successfully",
        data=recent_transactions,
    )


# ============================================================
# Statistics
# ============================================================

def get_bill_statistics_service(
    user_email: str,
):
    cursor = bills_collection.find(
        {
            "user_email": user_email
        }
    )

    total_bills = 0
    total_expense = 0
    total_paid = 0
    total_pending = 0
    paid_count = 0
    pending_count = 0
    highest_expense = 0

    category_summary = {}
    payment_summary = {}

    latest_bill = None

    for bill in cursor:

        bill = serialize_bill(bill)

        total_bills += 1

        amount = float(bill["amount"])
        status = str(bill.get("status", "Paid")).lower()

        total_expense += amount
        if status == "paid":
            total_paid += amount
            paid_count += 1
        else:
            total_pending += amount
            pending_count += 1

        if amount > highest_expense:
            highest_expense = amount

        category = bill["category"]

        if category not in category_summary:
            category_summary[category] = 0

        category_summary[category] += amount

        payment = bill["payment_mode"]

        if payment not in payment_summary:
            payment_summary[payment] = 0

        payment_summary[payment] += amount

        latest_bill = bill

    average_expense = 0

    if total_bills > 0:
        average_expense = round(
            total_expense / total_bills,
            2,
        )

    return success_response(
        message="Bill statistics fetched successfully",
        data={
            "total_bills": total_bills,
            "total_expense": round(total_expense, 2),
            "total_paid": round(total_paid, 2),
            "total_pending": round(total_pending, 2),
            "paid_count": paid_count,
            "pending_count": pending_count,
            "highest_expense": highest_expense,
            "average_expense": average_expense,
            "latest_bill": latest_bill,
            "category_summary": category_summary,
            "payment_summary": payment_summary,
        },
    )


# ============================================================
# Upcoming & Pending Bills
# ============================================================

def get_upcoming_bills_service(user_email: str):
    """
    Returns bills that are pending/unpaid, ordered by due date.
    """
    query = {
        "user_email": user_email,
        "status": {"$ne": "Paid"}
    }
    cursor = bills_collection.find(query).sort("due_date", ASCENDING).limit(10)
    bills = [serialize_bill(b) for b in cursor]
    return success_response(
        message="Upcoming bills fetched successfully",
        data=bills,
    )


# ============================================================
# Toggle Bill Status
# ============================================================

def toggle_bill_status_service(bill_id: str, user_email: str):
    """
    Toggles a bill's status between Paid and Pending.
    """
    try:
        bill = bills_collection.find_one({
            "_id": ObjectId(bill_id),
            "user_email": user_email,
        })
        if not bill:
            return None

        current_status = str(bill.get("status", "Paid")).lower()
        new_status = "Pending" if current_status == "paid" else "Paid"

        bills_collection.update_one(
            {"_id": ObjectId(bill_id)},
            {"$set": {"status": new_status}}
        )

        return success_response(
            message=f"Bill status updated to {new_status}",
            data={"bill_id": bill_id, "status": new_status}
        )
    except Exception as e:
        print(f"Error toggling bill status: {e}")
        return None


# ============================================================
# Raw Bills
# Used by Dashboard / AI / Export
# ============================================================

def get_raw_bills(
    user_email: str,
):
    bills = []

    cursor = bills_collection.find(
        {
            "user_email": user_email
        }
    )

    for bill in cursor:
        bills.append(
            serialize_bill(bill)
        )

    return bills


# ============================================================
# Upcoming Bills
# Bills with status != "Paid" and due_date >= today
# ============================================================

def get_upcoming_bills_service(user_email: str):
    from datetime import date
    today = str(date.today())
    query = {
        "user_email": user_email,
        "status": {"$ne": "Paid"},
        "due_date": {"$gte": today, "$exists": True, "$ne": None},
    }
    cursor = bills_collection.find(query).sort("due_date", ASCENDING).limit(10)
    bills = [serialize_bill(b) for b in cursor]
    return success_response(message="Upcoming bills fetched", data=bills)