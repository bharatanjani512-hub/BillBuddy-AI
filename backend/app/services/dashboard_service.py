from collections import defaultdict
from datetime import datetime

from app.database.connection import database

from app.services.budget_service import get_raw_budget
from app.services.goal_service import get_raw_goals

bills_collection = database["bills"]


# =====================================
# Dashboard Summary
# =====================================
def get_dashboard_summary(user_email: str):

    bills = list(
        bills_collection.find(
            {
                "user_email": user_email
            }
        )
    )

    total_transactions = len(bills)

    total_expense = sum(
        bill["amount"]
        for bill in bills
    )

    budget = get_raw_budget(user_email)

    monthly_budget = 0

    if budget:
        monthly_budget = budget.get(
            "monthly_budget",
            0
        )

    goals = get_raw_goals(user_email)

    savings_goal = sum(
        goal.get(
            "target_amount",
            0
        )
        for goal in goals
    )

    return {
        "total_transactions": total_transactions,
        "total_expense": total_expense,
        "monthly_budget": monthly_budget,
        "savings_goal": savings_goal,
    }


# =====================================
# Monthly Expense Chart
# =====================================
def get_monthly_chart(user_email: str):

    bills = list(
        bills_collection.find(
            {
                "user_email": user_email
            }
        )
    )

    monthly_data = defaultdict(float)

    month_order = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    # -------------------------
    # Group expenses by month
    # -------------------------

    for bill in bills:

        try:

            bill_date = datetime.strptime(
                bill["date"],
                "%Y-%m-%d"
            )

            month_name = bill_date.strftime("%b")

            monthly_data[month_name] += float(
                bill["amount"]
            )

        except Exception:
            continue

    chart = []

    for month in month_order:

        chart.append(
            {
                "month": month,
                "expense": round(
                    monthly_data.get(month, 0),
                    2
                )
            }
        )

    return chart


# =====================================
# Category Expense Chart
# =====================================

def get_category_chart(user_email: str):

    bills = list(
        bills_collection.find(
            {
                "user_email": user_email
            }
        )
    )

    category_data = defaultdict(float)

    for bill in bills:

        category = bill.get(
            "category",
            "Others"
        )

        category_data[category] += float(
            bill["amount"]
        )

    chart = []

    for category, amount in category_data.items():

        chart.append(
            {
                "category": category,
                "amount": round(
                    amount,
                    2
                )
            }
        )

    return sorted(
        chart,
        key=lambda x: x["amount"],
        reverse=True
    )


# =====================================
# Recent Transactions
# =====================================
def get_recent_transactions(
    user_email: str,
    limit: int = 5
):

    transactions = []

    cursor = (
        bills_collection.find(
            {
                "user_email": user_email
            }
        )
        .sort("date", -1)
        .limit(limit)
    )

    for bill in cursor:

        bill["_id"] = str(
            bill["_id"]
        )

        transactions.append(bill)

    return transactions


# =====================================
# Dashboard Analytics
# =====================================
def get_dashboard_analytics(
    user_email: str
):

    return {
        "summary": get_dashboard_summary(
            user_email
        ),
        "monthly_chart": get_monthly_chart(
            user_email
        ),
        "category_chart": get_category_chart(
            user_email
        ),
        "recent_transactions": get_recent_transactions(
            user_email
        ),
    }
def get_raw_budget(user_email):
    return budget_collection.find_one(
        {
            "user_email": user_email
        }
    )