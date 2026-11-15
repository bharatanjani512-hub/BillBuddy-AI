import json
from app.prompts.financial_chat_prompt import FINANCIAL_CHAT_PROMPT
from app.services.bill_service import get_raw_bills
from app.services.budget_service import get_raw_budget
from app.services.goal_service import get_raw_goals
from app.services.analytics_service import generate_statistics
from app.services.financial_context_service import build_financial_context
from app.services.gemini_service import generate_gemini_response
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
    q_lower = question.lower().strip()
    owner_triggers = [
        "who is the owner",
        "who is your owner",
        "owner of you",
        "who created you",
        "who made you",
        "who built you",
        "who is your creator",
        "who owns you",
        "who designed you",
        "who founded you",
    ]
    if any(trigger in q_lower for trigger in owner_triggers):
        return {
            "answer": (
                "My owner is **Anjani Bharat Chauhan**. She is the engineer and creator behind BillBuddy AI, "
                "and she built this platform to automate expense management, bill scanning, and corporate budgeting. "
                "Consider her the mastermind, and me her dedicated financial assistant."
            )
        }

    try:
        # ---------------------------------------
        # Fetch User
        # ---------------------------------------
        user = get_user_profile(user_email)
        if not user:
            user = {
                "full_name": user_email.split("@")[0],
                "email": user_email,
                "currency": "INR",
            }

        # ---------------------------------------
        # Fetch Bills
        # ---------------------------------------
        bills = []
        try:
            bills = get_raw_bills(user_email) or []
        except Exception as e:
            print(f"Chat: error fetching bills: {e}")

        # ---------------------------------------
        # Fetch Budget
        # ---------------------------------------
        budget = {}
        try:
            raw_b = get_raw_budget(user_email)
            if raw_b:
                raw_b["_id"] = str(raw_b.get("_id", ""))
                budget = raw_b
        except Exception as e:
            print(f"Chat: error fetching budget: {e}")

        # ---------------------------------------
        # Fetch Goals
        # ---------------------------------------
        goals = []
        try:
            goals = get_raw_goals(user_email) or []
        except Exception as e:
            print(f"Chat: error fetching goals: {e}")

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

        financial_context["statistics"] = analytics.get("statistics", {})
        financial_context["rule_based_insights"] = analytics.get("insights", [])

        # ---------------------------------------
        # Create Prompt with safe default=str serializer
        # ---------------------------------------
        prompt = FINANCIAL_CHAT_PROMPT.format(
            financial_data=json.dumps(
                financial_context,
                default=str,
                indent=2
            ),
            question=question,
        )

        # ---------------------------------------
        # Ask Gemini
        # ---------------------------------------
        answer = generate_gemini_response(
            prompt=prompt,
            response_mime_type="text/plain",
        )

        return {
            "answer": answer
        }

    except Exception as e:
        print("\n========== CHAT ERROR ==========")
        print(f"Exception in generate_chat_response: {e}")
        print("================================\n")

        # Fallback to direct Gemini query if context failed
        try:
            fallback_prompt = f"You are BillBuddy, a smart financial assistant. The user is asking: '{question}'. Answer in a friendly, helpful, and concise manner."
            answer = generate_gemini_response(prompt=fallback_prompt, response_mime_type="text/plain")
            return {"answer": answer}
        except Exception as fallback_err:
            print(f"Fallback chat error: {fallback_err}")
            return {
                "answer": (
                    "I am currently reviewing your financial data. "
                    "Please try your question again in a moment!"
                )
            }
