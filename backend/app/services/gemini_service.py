import json
from google import genai
from google.genai import types

from app.config import settings

client = None
if settings.GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        print(f"⚠️ Failed to initialize Gemini client: {e}")


def _get_candidate_models():
    primary = settings.GEMINI_MODEL or "gemini-3.6-flash"
    candidates = [primary, "gemini-3.6-flash", "gemini-3.8-flash"]
    seen = set()
    result = []
    for m in candidates:
        if m and m not in seen:
            seen.add(m)
            result.append(m)
    return result


def generate_gemini_response(
    prompt: str,
    response_mime_type: str = "text/plain",
):
    """
    Sends a prompt to Gemini and returns the response.
    Supports both plain text and JSON responses.
    """
    if not client:
        if response_mime_type == "application/json":
            return {}
        return "Gemini API client not configured."

    last_error = None
    for model_name in _get_candidate_models():
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "response_mime_type": response_mime_type
                },
            )

            if response_mime_type == "application/json":
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                return json.loads(text.strip())

            return response.text.strip()
        except Exception as e:
            last_error = e
            print(f"⚠️ Gemini model '{model_name}' failed: {e}. Trying fallback...")

    if response_mime_type == "application/json":
        return {}
    return f"Unable to generate response. Please try again. ({last_error})"


def generate_gemini_scan_response(
    file_bytes: bytes,
    mime_type: str,
    prompt: str,
):
    """
    Multimodal bill & receipt scanner using Gemini Vision.
    """
    if not client:
        return {
            "title": "Scanned Bill",
            "amount": 0.0,
            "category": "Utilities",
            "merchant": "Unknown Merchant",
            "date": "",
            "due_date": None,
            "status": "Pending",
            "payment_mode": "UPI",
            "notes": "Gemini API key not configured.",
        }

    contents = [
        types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
        prompt,
    ]

    last_error = None
    for model_name in _get_candidate_models():
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config={
                    "response_mime_type": "application/json"
                },
            )

            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]

            return json.loads(text.strip())
        except Exception as e:
            last_error = e
            print(f"⚠️ Gemini scan with model '{model_name}' failed: {e}. Trying fallback...")

    raise RuntimeError(f"All Gemini models failed to scan bill: {last_error}")
