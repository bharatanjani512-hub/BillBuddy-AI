from bson import ObjectId

from app.database.connection import database
from app.responses.api_response import success_response

bills_collection = database["bills"]


# ==========================
# Create Bill
# ==========================
def create_bill_service(
    bill_data: dict,
    user_email: str
):
    bill_data["user_email"] = user_email

    bills_collection.insert_one(bill_data)

    return success_response(
        message="Bill Created Successfully",
        data={
            "user": user_email
        }
    )


# ==========================
# Get Bills
# ==========================
def get_bills_service(
    user_email: str
):
    bills = []

    for bill in bills_collection.find(
        {"user_email": user_email}
    ):
        # Convert ObjectId to string
        bill["_id"] = str(bill["_id"])

        # Remove internal field before sending response
        bill.pop("user_email", None)

        bills.append(bill)

    return success_response(
        message="Bills fetched successfully",
        data=bills
    )


# ==========================
# Get Single Bill
# ==========================
def get_bill_by_id_service(
    bill_id: str,
    user_email: str
):
    return bills_collection.find_one(
        {
            "_id": ObjectId(bill_id),
            "user_email": user_email
        }
    )


# ==========================
# Update Bill
# ==========================
def update_bill_service(
    bill_id: str,
    bill_data: dict,
    user_email: str
):
    existing_bill = get_bill_by_id_service(
        bill_id,
        user_email
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


# ==========================
# Delete Bill
# ==========================
def delete_bill_service(
    bill_id: str,
    user_email: str
):
    existing_bill = get_bill_by_id_service(
        bill_id,
        user_email
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

# ==========================
# Get Recent Transactions
# ==========================
def get_recent_transactions_service(
    user_email: str,
    limit: int = 5
):
    recent_transactions = []

    cursor = (
        bills_collection
        .find(
            {"user_email": user_email},
            {
                "user_email": 0
            }
        )
        .sort("_id", -1)
        .limit(limit)
    )

    for bill in cursor:
        bill["_id"] = str(bill["_id"])
        recent_transactions.append(bill)

    return success_response(
        message="Recent transactions fetched successfully",
        data=recent_transactions
    )