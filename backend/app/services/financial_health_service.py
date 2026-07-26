def calculate_financial_health(
    monthly_budget: float,
    spent_this_month: float
):
    """
    Calculates a financial health score based
    on monthly budget usage.
    """

    if monthly_budget <= 0:
        return {
            "score": 0,
            "status": "No Budget",
            "message": "Please set a monthly budget first."
        }

    usage_percentage = (
        spent_this_month / monthly_budget
    ) * 100

    if usage_percentage < 50:
        score = 100
        status = "Excellent"
        message = "Your spending is well within your monthly budget."

    elif usage_percentage < 80:
        score = 80
        status = "Good"
        message = "Your spending is under control."

    elif usage_percentage <= 100:
        score = 60
        status = "Warning"
        message = "You are close to reaching your monthly budget."

    else:
        score = 30
        status = "Critical"
        message = "You have exceeded your monthly budget."

    return {
        "score": score,
        "status": status,
        "message": message
    }