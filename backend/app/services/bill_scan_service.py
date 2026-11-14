from datetime import date
from app.services.gemini_service import generate_gemini_scan_response
from app.responses.api_response import success_response, error_response

BILL_SCAN_PROMPT = """You are an expert financial and bill scanning assistant for BillBuddy AI.
Examine this bill, receipt, or invoice image carefully.
Extract the relevant business/personal finance details and return a strictly valid JSON object with the following fields:
{
  "title": "A concise title (e.g., 'Electricity Bill - Tata Power', 'Airtel Broadband', 'Office Rent', 'AWS Cloud Services', or vendor receipt)",
  "merchant": "Name of the company, vendor, utility board, or merchant",
  "amount": numeric total amount due or paid (as a float, e.g. 1450.50),
  "category": "one of: Electricity, Utilities, Internet, Rent, Office Supplies, Food, Travel, Software, Medical, Insurance, Tax, Other",
  "date": "Bill date or issue date in YYYY-MM-DD format (if missing, use today's date)",
  "due_date": "Due date or payment deadline in YYYY-MM-DD format, or null if already paid or not specified",
  "status": "Either 'Paid' or 'Pending' (if it shows PAID or receipt, use 'Paid'; if it's an unpaid bill with a due date, use 'Pending')",
  "payment_mode": "one of: UPI, Credit Card, Debit Card, Net Banking, Cash, Auto-Debit, Other",
  "notes": "Any invoice number, account/consumer number, or summary of items (max 200 chars)"
}
Return ONLY valid JSON matching this exact structure. Do not include markdown codeblocks or explanation.
"""


def scan_bill_file(file_bytes: bytes, filename: str, content_type: str = "image/jpeg"):
    """
    Scans a bill image or PDF and returns structured bill information.
    """
    if not file_bytes:
        return error_response(message="Empty file uploaded.")

    mime_type = content_type or "image/jpeg"
    if filename.lower().endswith(".pdf"):
        mime_type = "application/pdf"
    elif filename.lower().endswith(".png"):
        mime_type = "image/png"
    elif filename.lower().endswith(".webp"):
        mime_type = "image/webp"

    try:
        extracted = generate_gemini_scan_response(
            file_bytes=file_bytes,
            mime_type=mime_type,
            prompt=BILL_SCAN_PROMPT,
        )

        # Normalize default fields if missing
        if not extracted.get("date"):
            extracted["date"] = str(date.today())

        if "amount" in extracted:
            try:
                extracted["amount"] = float(extracted["amount"])
            except Exception:
                extracted["amount"] = 0.0

        if not extracted.get("status"):
            extracted["status"] = "Pending" if extracted.get("due_date") else "Paid"

        return success_response(
            message="Bill scanned successfully with Gemini AI!",
            data=extracted,
        )

    except Exception as e:
        print(f"Error scanning bill: {e}")
        return error_response(
            message=f"Failed to scan bill with AI: {str(e)}"
        )
