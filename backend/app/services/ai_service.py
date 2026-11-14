import json

from app.prompts.financial_insights import FINANCIAL_INSIGHTS_PROMPT
from app.services.gemini_service import generate_gemini_response

DEFAULT_RESPONSE = {
    "summary": "",
    "good_habits": [],
    "risky_habits": [],
    "recommendations": [],
    "confidence": {
        "level": "Low",
        "reason": "Not enough data is available to generate reliable financial insights."
    }
}


def generate_ai_insights(financial_statistics: dict):
    """
    Generates AI-powered financial insights using Gemini.

    Always returns a predictable JSON object.
    """

    prompt = FINANCIAL_INSIGHTS_PROMPT.format(
        financial_statistics=json.dumps(
            financial_statistics,
            indent=2
        )
    )

    try:
        parsed = generate_gemini_response(
            prompt=prompt,
            response_mime_type="application/json",
        )

        return {
            "summary": parsed.get("summary", ""),
            "good_habits": parsed.get("good_habits", []),
            "risky_habits": parsed.get("risky_habits", []),
            "recommendations": parsed.get("recommendations", []),
            "confidence": parsed.get(
                "confidence",
                DEFAULT_RESPONSE["confidence"]
            ),
        }

    except Exception as e:
        print("\n===== GEMINI ERROR =====")
        print(e)
        print("========================\n")
        return DEFAULT_RESPONSE