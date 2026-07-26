from app.services.analytics_service import generate_statistics


def generate_financial_insights(bills: list):
    """
    Generates financial recommendations
    using analytics generated from bills.
    """

    analytics = generate_statistics(bills)

    statistics = analytics["statistics"]
    insights = analytics["insights"]

    recommendations = []

    # ==========================
    # Empty Bills
    # ==========================

    if statistics["total_bills"] == 0:
        recommendations.append(
            "Start adding your daily expenses to unlock personalized financial insights."
        )

        return {
            "statistics": statistics,
            "insights": insights,
            "recommendations": recommendations,
        }

    # ==========================
    # Spending Analysis
    # ==========================

    if statistics["average_expense"] > 1000:
        recommendations.append(
            "Your average expense is relatively high. Review your daily spending habits."
        )

    if statistics["most_used_category"] == "Food":
        recommendations.append(
            "Food is your highest activity category. Consider setting a monthly food budget."
        )

    if statistics["most_used_category"] == "Shopping":
        recommendations.append(
            "Shopping appears frequently in your expenses. Review whether every purchase was necessary."
        )

    if statistics["most_used_category"] == "Entertainment":
        recommendations.append(
            "Entertainment spending is significant. Planning a fixed entertainment budget can help."
        )

    if statistics["total_expense"] > 10000:
        recommendations.append(
            "Your total spending has crossed ₹10,000. Consider reviewing your largest expenses."
        )

    if statistics["total_bills"] < 10:
        recommendations.append(
            "Track more expenses for more accurate financial insights."
        )

    if len(recommendations) == 0:
        recommendations.append(
            "Great job! Your spending pattern looks balanced."
        )

    return {
        "statistics": statistics,
        "insights": insights,
        "recommendations": recommendations,
    }