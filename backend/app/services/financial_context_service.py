from app.services.analytics_service import generate_statistics


def build_financial_context(
    user: dict,
    bills: list,
    budget: dict | None = None,
    goal: dict | None = None,
) -> dict:
    """
    Builds a single financial context object that can be
    passed to Gemini for intelligent financial conversations.
    """

    analytics = generate_statistics(bills)

    context = {
        "user": {
            "name": user.get("full_name"),
            "email": user.get("email"),
            "monthly_income": user.get("monthly_income"),
            "currency": user.get("currency", "INR"),
        },
        "statistics": analytics["statistics"],
        "insights": analytics["insights"],
        "budget": budget if budget else {},
        "goal": goal if goal else {},
    }

    return context