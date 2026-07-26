from collections import Counter


# ==========================
# Analytics Service
# ==========================

def generate_statistics(bills: list):
    """
    Generates expense statistics
    and rule-based insights.
    """

    # ==========================
    # Handle Empty Bills
    # ==========================

    if not bills:
        return {
            "statistics": {
                "total_bills": 0,
                "total_expense": 0,
                "average_expense": 0,
                "highest_expense": None,
                "lowest_expense": None,
                "most_used_category": None,
                "most_used_payment_mode": None,
            },
            "insights": [
                "No expenses found. Start adding bills to receive personalized insights."
            ],
        }

    # ==========================
    # Basic Statistics
    # ==========================

    total_bills = len(bills)

    total_expense = sum(
        bill["amount"]
        for bill in bills
    )

    average_expense = round(
        total_expense / total_bills,
        2
    )

    highest_expense = max(
        bills,
        key=lambda bill: bill["amount"]
    )

    lowest_expense = min(
        bills,
        key=lambda bill: bill["amount"]
    )

    # ==========================
    # Category Analysis
    # ==========================

    categories = [
        bill["category"]
        for bill in bills
    ]

    category_counter = Counter(categories)

    most_used_category = (
        category_counter.most_common(1)[0][0]
    )

    # ==========================
    # Payment Mode Analysis
    # ==========================

    payment_modes = [
        bill["payment_mode"]
        for bill in bills
    ]

    payment_counter = Counter(payment_modes)

    most_used_payment_mode = (
        payment_counter.most_common(1)[0][0]
    )

    # ==========================
    # Rule-Based Insights
    # ==========================

    insights = []

    insights.append(
        f"Your highest spending category is {most_used_category}."
    )

    insights.append(
        f"You mostly use {most_used_payment_mode} for your payments."
    )

    insights.append(
        f"Your average expense is ₹{average_expense:.2f}."
    )

    insights.append(
        f"Your highest expense was '{highest_expense['title']}' costing ₹{highest_expense['amount']:.2f}."
    )

    insights.append(
        f"Your lowest expense was '{lowest_expense['title']}' costing ₹{lowest_expense['amount']:.2f}."
    )

    if total_bills < 5:
        insights.append(
            "Add more expenses to unlock deeper spending insights."
        )

    if total_expense > 10000:
        insights.append(
            "Your spending is relatively high. Consider reviewing your recent expenses."
        )

    return {
        "statistics": {
            "total_bills": total_bills,
            "total_expense": total_expense,
            "average_expense": average_expense,
            "highest_expense": {
                "title": highest_expense["title"],
                "amount": highest_expense["amount"],
            },
            "lowest_expense": {
                "title": lowest_expense["title"],
                "amount": lowest_expense["amount"],
            },
            "most_used_category": most_used_category,
            "most_used_payment_mode": most_used_payment_mode,
        },
        "insights": insights,
    }