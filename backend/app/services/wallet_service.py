from datetime import datetime
from bson import ObjectId
from app.database.connection import database
from app.responses.api_response import success_response
from app.exceptions.custom_exceptions import ResourceNotFoundException

wallets_collection = database["wallets"]
wallet_tx_collection = database["wallet_transactions"]


def serialize_wallet(w):
    if not w:
        return None
    w["_id"] = str(w["_id"])
    return w


def get_wallets_service(user_email: str, workspace_id: str = None):
    query = {
        "$or": [
            {"manager_email": user_email},
            {"allowed_members": user_email}
        ]
    }
    if workspace_id:
        query["workspace_id"] = workspace_id

    wallets = []
    for doc in wallets_collection.find(query):
        wallets.append(serialize_wallet(doc))

    return success_response(
        message="Wallets fetched successfully",
        data=wallets
    )


def get_wallet_by_id_service(wallet_id: str, user_email: str):
    w = wallets_collection.find_one({
        "_id": ObjectId(wallet_id),
        "$or": [
            {"manager_email": user_email},
            {"allowed_members": user_email}
        ]
    })
    if not w:
        raise ResourceNotFoundException("Wallet not found or access denied")
    return success_response(
        message="Wallet details fetched",
        data=serialize_wallet(w)
    )


def create_wallet_service(wallet_data: dict, user_email: str):
    wallet_data["manager_email"] = user_email
    wallet_data["total_spent"] = 0.0
    wallet_data["created_at"] = datetime.utcnow().isoformat()
    if not wallet_data.get("allowed_members"):
        wallet_data["allowed_members"] = [user_email]
    elif user_email not in wallet_data["allowed_members"]:
        wallet_data["allowed_members"].append(user_email)

    res = wallets_collection.insert_one(wallet_data)
    return success_response(
        message="Corporate Wallet created successfully",
        data={"wallet_id": str(res.inserted_id)}
    )


def add_funds_service(wallet_id: str, amount: float, notes: str, user_email: str):
    w = wallets_collection.find_one({
        "_id": ObjectId(wallet_id),
        "manager_email": user_email
    })
    if not w:
        raise ResourceNotFoundException("Wallet not found or only managers can add funds")

    new_balance = round(float(w.get("balance", 0.0)) + float(amount), 2)
    new_allocated = round(float(w.get("total_allocated", 0.0)) + float(amount), 2)

    wallets_collection.update_one(
        {"_id": ObjectId(wallet_id)},
        {
            "$set": {
                "balance": new_balance,
                "total_allocated": new_allocated,
                "updated_at": datetime.utcnow().isoformat()
            }
        }
    )

    # Log funding transaction
    wallet_tx_collection.insert_one({
        "wallet_id": wallet_id,
        "type": "deposit",
        "amount": float(amount),
        "notes": notes or "Fund deposit",
        "user_email": user_email,
        "created_at": datetime.utcnow().isoformat()
    })

    return success_response(
        message=f"Added ₹{amount:,.2f} to Corporate Wallet",
        data={
            "wallet_id": wallet_id,
            "balance": new_balance,
            "total_allocated": new_allocated
        }
    )


def deduct_wallet_expense(wallet_id: str, amount: float, bill_title: str, user_email: str):
    """
    Called when a bill is charged to a corporate wallet.
    Deducts balance and adds to total_spent.
    """
    try:
        w = wallets_collection.find_one({"_id": ObjectId(wallet_id)})
        if not w:
            return False

        new_balance = round(float(w.get("balance", 0.0)) - float(amount), 2)
        new_spent = round(float(w.get("total_spent", 0.0)) + float(amount), 2)

        wallets_collection.update_one(
            {"_id": ObjectId(wallet_id)},
            {
                "$set": {
                    "balance": new_balance,
                    "total_spent": new_spent,
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )

        wallet_tx_collection.insert_one({
            "wallet_id": wallet_id,
            "type": "expense",
            "amount": float(amount),
            "bill_title": bill_title,
            "user_email": user_email,
            "created_at": datetime.utcnow().isoformat()
        })
        return True
    except Exception as e:
        print(f"Error deducting from wallet: {e}")
        return False
