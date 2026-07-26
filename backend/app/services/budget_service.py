from datetime import datetime

from app.database.connection import database

users_collection = database["users"]
bills_collection = database["bills"]


def save_budget(user_email: str, monthly_budget: float):
    users_collection.update_one(
        {"email": user_email},
        {
            "$set": {
                "monthly_budget": monthly_budget
            }
        }
    )


def get_budget(user_email: str):
    user = users_collection.find_one(
        {"email": user_email},
        {
            "_id": 0,
            "monthly_budget": 1,
            "currency": 1
        }
    )

    return user


def get_current_month_expense(user_email: str):
    """
    Calculates the total amount spent by the user
    in the current month.
    """

    current_month = datetime.now().month
    current_year = datetime.now().year

    total = 0

    bills = bills_collection.find({
        "user_email": user_email
    })

    for bill in bills:

        bill_date = datetime.strptime(
            bill["date"],
            "%Y-%m-%d"
        )

        if (
            bill_date.month == current_month
            and bill_date.year == current_year
        ):
            total += bill["amount"]

    return total