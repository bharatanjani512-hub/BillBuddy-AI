import json

from google import genai

from app.config import settings
from app.prompts.financial_insights import FINANCIAL_INSIGHTS_PROMPT

client = genai.Client(api_key=settings.GEMINI_API_KEY)

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
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            },
        )

        text = response.text.strip()

        print("\n========== GEMINI RAW RESPONSE ==========")
        print(text)
        print("=========================================\n")

        parsed = json.loads(text)

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

    except json.JSONDecodeError as e:
        print("\n===== JSON PARSE ERROR =====")
        print(e)
        print("============================\n")
        return DEFAULT_RESPONSE

    except Exception as e:
        print("\n===== GEMINI ERROR =====")
        print(e)
        print("========================\n")
        return DEFAULT_RESPONSE