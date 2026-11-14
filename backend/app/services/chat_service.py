import json

from app.prompts.financial_chat_prompt import (
    FINANCIAL_CHAT_PROMPT,
)

from app.services.bill_service import (
    get_raw_bills,
)

from app.services.budget_service import (
    get_raw_budget,
)

from app.services.goal_service import (
    get_raw_goals,
)

from app.services.analytics_service import (
    generate_statistics,
)

from app.services.financial_context_service import (
    build_financial_context,
)

from app.services.gemini_service import (
    generate_gemini_response,
)

from app.database.connection import database


users_collection = database["users"]


def get_user_profile(user_email: str):
    """
    Returns the user's profile.
    """

    return users_collection.find_one(
        {"email": user_email},
        {
            "_id": 0,
            "password": 0
        }
    )


def generate_chat_response(
    question: str,
    user_email: str,
):
    """
    Generates an AI-powered financial chat response.
    """

    # ---------------------------------------
    # Fetch User
    # ---------------------------------------

    user = get_user_profile(user_email)

    if user is None:
        return {
            "answer": "User not found."
        }

    # ---------------------------------------
    # Fetch Bills
    # ---------------------------------------

    bills = get_raw_bills(user_email)

    # ---------------------------------------
    # Fetch Budget
    # ---------------------------------------

    budget = get_raw_budget(user_email)

    # ---------------------------------------
    # Fetch Goals
    # ---------------------------------------

    goals = get_raw_goals(user_email)

    # ---------------------------------------
    # Generate Analytics
    # ---------------------------------------

    analytics = generate_statistics(bills)

    # ---------------------------------------
    # Build Financial Context
    # ---------------------------------------

    financial_context = build_financial_context(
        user=user,
        bills=bills,
        budget=budget,
        goal=goals,
    )

    # Add analytics to the context
    financial_context["statistics"] = analytics["statistics"]
    financial_context["rule_based_insights"] = analytics["insights"]

    # ---------------------------------------
    # Create Prompt
    # ---------------------------------------

    prompt = FINANCIAL_CHAT_PROMPT.format(
        financial_data=json.dumps(
            financial_context,
            indent=2
        ),
        question=question,
    )

    # ---------------------------------------
    # Ask Gemini
    # ---------------------------------------

    try:

        answer = generate_gemini_response(
            prompt=prompt,
            response_mime_type="text/plain",
        )

        return {
            "answer": answer
        }

    except Exception as e:

        print("\n========== CHAT ERROR ==========")
        print(e)
        print("================================\n")

        return {
            "answer": (
                "Sorry, I couldn't generate a response right now. "
                "Please try again in a few moments."
            )
        }
    
