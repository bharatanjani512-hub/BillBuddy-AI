from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File

from app.dependencies.auth import get_current_user
from app.models.bill import Bill

from app.services.bill_service import (
    create_bill_service,
    get_bills_service,
    update_bill_service,
    delete_bill_service,
    get_recent_transactions_service,
    get_bill_statistics_service,
    get_upcoming_bills_service,
    toggle_bill_status_service,
)
from app.services.bill_scan_service import scan_bill_file

router = APIRouter()


# ============================================================
# Create Bill
# ============================================================

@router.post("/create")
def create_bill(
    bill: Bill,
    current_user: dict = Depends(get_current_user),
):
    return create_bill_service(
        bill_data=bill.dict(),
        user_email=current_user["sub"],
    )


# ============================================================
# Scan Bill / Receipt (AI OCR using Gemini)
# ============================================================

@router.post("/scan")
async def scan_bill(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """
    Accepts an uploaded image or PDF of a bill/receipt and extracts
    title, merchant, amount, category, date, due_date, status, payment_mode.
    """
    content = await file.read()
    return scan_bill_file(
        file_bytes=content,
        filename=file.filename or "receipt.jpg",
        content_type=file.content_type or "image/jpeg",
    )


# ============================================================
# Upcoming & Pending Bills
# ============================================================

@router.get("/upcoming")
def get_upcoming_bills(
    current_user: dict = Depends(get_current_user),
):
    return get_upcoming_bills_service(
        user_email=current_user["sub"]
    )


# ============================================================
# Get Bills
# ============================================================

@router.get("/")
def get_my_bills(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    payment_mode: str | None = None,
    status: str | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
    from_date: str | None = None,
    to_date: str | None = None,
    sort: str = "latest",
    workspace_id: str | None = None,
    current_user: dict = Depends(get_current_user),
):
    return get_bills_service(
        user_email=current_user["sub"],
        page=page,
        limit=limit,
        search=search,
        category=category,
        payment_mode=payment_mode,
        status=status,
        min_amount=min_amount,
        max_amount=max_amount,
        from_date=from_date,
        to_date=to_date,
        sort=sort,
        workspace_id=workspace_id,
    )


# ============================================================
# Statistics
# ============================================================

@router.get("/statistics")
def get_statistics(
    current_user: dict = Depends(get_current_user),
):
    return get_bill_statistics_service(
        user_email=current_user["sub"]
    )


# ============================================================
# Recent Transactions
# ============================================================

@router.get("/recent")
def get_recent_transactions(
    limit: int = Query(
        5,
        ge=1,
        le=20,
    ),
    current_user: dict = Depends(get_current_user),
):
    return get_recent_transactions_service(
        user_email=current_user["sub"],
        limit=limit,
    )


# ============================================================
# Toggle Bill Status (Paid <-> Pending)
# ============================================================

@router.patch("/{bill_id}/toggle-status")
def toggle_bill_status(
    bill_id: str,
    current_user: dict = Depends(get_current_user),
):
    result = toggle_bill_status_service(
        bill_id=bill_id,
        user_email=current_user["sub"],
    )
    if result is None:
        raise HTTPException(status_code=404, detail="Bill not found.")
    return result


# ============================================================
# Update Bill
# ============================================================

@router.put("/{bill_id}")
def update_bill(
    bill_id: str,
    bill: Bill,
    current_user: dict = Depends(get_current_user),
):
    result = update_bill_service(
        bill_id=bill_id,
        bill_data=bill.dict(),
        user_email=current_user["sub"],
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found.",
        )

    return result


# ============================================================
# Delete Bill
# ============================================================

@router.delete("/{bill_id}")
def delete_bill(
    bill_id: str,
    current_user: dict = Depends(get_current_user),
):
    result = delete_bill_service(
        bill_id=bill_id,
        user_email=current_user["sub"],
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found.",
        )

    return result
