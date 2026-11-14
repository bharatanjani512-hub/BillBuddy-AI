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

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
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

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
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
