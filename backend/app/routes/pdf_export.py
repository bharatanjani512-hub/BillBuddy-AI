from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from app.database.connection import database
from app.utils.security import (
    verify_access_token,
    oauth2_scheme,
)

router = APIRouter()

# ==========================
# Register Fonts
# ==========================

pdfmetrics.registerFont(
    TTFont(
        "Inter",
        "fonts/Inter_18pt-Regular.ttf"
    )
)

pdfmetrics.registerFont(
    TTFont(
        "Inter-Bold",
        "fonts/Inter_18pt-Bold.ttf"
    )
)

bills_collection = database["bills"]


# ==========================
# Export Bills as PDF
# ==========================

@router.get("/pdf")
def export_pdf(
    token: str = Depends(oauth2_scheme)
):
    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    user_email = payload["sub"]

    bills = list(
        bills_collection.find(
            {
                "user_email": user_email
            },
            {
                "_id": 0,
                "user_email": 0
            }
        )
    )

    if not bills:
        raise HTTPException(
            status_code=404,
            detail="No bills found."
        )

    # ==========================
    # Create Export Folder
    # ==========================

    export_dir = Path("exports")
    export_dir.mkdir(exist_ok=True)

    file_path = export_dir / "expense_report.pdf"

    pdf = canvas.Canvas(
        str(file_path),
        pagesize=A4
    )

    # ==========================
    # Layout Settings
    # ==========================

    page_width = A4[0]

    left_margin = 60
    right_margin = 60

    title_y = 800
    subtitle_y = 770
    date_y = 735

    header_y = 680
    row_start_y = 650
    row_height = 22

    title_column = left_margin
    category_column = 260
    amount_column = 430

    # ==========================
    # Title
    # ==========================

    pdf.setFont("Inter-Bold", 20)

    title = "BillBuddy AI"

    title_width = pdf.stringWidth(
        title,
        "Inter-Bold",
        20
    )

    title_x = (page_width - title_width) / 2

    pdf.drawString(
        title_x,
        title_y,
        title
    )

    # ==========================
    # Subtitle
    # ==========================

    pdf.setFont("Inter", 14)

    subtitle = "Expense Report"

    subtitle_width = pdf.stringWidth(
        subtitle,
        "Inter",
        14
    )

    subtitle_x = (
        page_width - subtitle_width
    ) / 2

    pdf.drawString(
        subtitle_x,
        subtitle_y,
        subtitle
    )

    # ==========================
    # Date
    # ==========================

    current_date = datetime.now().strftime(
        "%d %B %Y"
    )

    pdf.setFont("Inter", 11)

    pdf.drawString(
        left_margin,
        date_y,
        f"Generated on: {current_date}"
    )

    # ==========================
    # Table Header
    # ==========================

    pdf.setFont("Inter-Bold", 12)

    pdf.drawString(
        title_column,
        header_y,
        "Title"
    )

    pdf.drawString(
        category_column,
        header_y,
        "Category"
    )

    pdf.drawString(
        amount_column,
        header_y,
        "Amount"
    )

    pdf.line(
        left_margin,
        header_y - 10,
        page_width - right_margin,
        header_y - 10
    )

    # ==========================
    # Bills
    # ==========================

    y = row_start_y

    pdf.setFont("Inter", 11)

    for bill in bills:

        pdf.drawString(
            title_column,
            y,
            bill["title"]
        )

        pdf.drawString(
            category_column,
            y,
            bill["category"]
        )

        pdf.drawString(
            amount_column,
            y,
            f"₹ {bill['amount']:.2f}"
        )

        y -= row_height

    # ==========================
    # Total
    # ==========================

    total_amount = sum(
        bill["amount"]
        for bill in bills
    )

    pdf.line(
        left_margin,
        y - 10,
        page_width - right_margin,
        y - 10
    )

    pdf.setFont(
        "Inter-Bold",
        13
    )

    pdf.drawString(
        left_margin,
        y - 30,
        f"Total Expense: ₹ {total_amount:.2f}"
    )

    # ==========================
    # Save PDF
    # ==========================

    pdf.save()

    return FileResponse(
        path=str(file_path),
        filename="expense_report.pdf",
        media_type="application/pdf"
    )