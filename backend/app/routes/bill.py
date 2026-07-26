from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_current_user
from app.models.bill import Bill
from app.services.bill_service import (
    create_bill_service,
    get_bills_service,
    get_recent_transactions_service,
    update_bill_service,
    delete_bill_service,
)

router = APIRouter()


# ==========================
# Create Bill
# ==========================
@router.post("/create")
def create_bill(
    bill: Bill,
    current_user: dict = Depends(get_current_user)
):
    return create_bill_service(
        bill_data=bill.dict(),
        user_email=current_user["sub"]
    )


# ==========================
# Get All Bills
# ==========================
@router.get("/")
def get_my_bills(
    current_user: dict = Depends(get_current_user)
):
    return get_bills_service(
        user_email=current_user["sub"]
    )


# ==========================
# Get Recent Transactions
# ==========================
@router.get("/recent")
def get_recent_transactions(
    current_user: dict = Depends(get_current_user)
):
    return get_recent_transactions_service(
        user_email=current_user["sub"]
    )


# ==========================
# Update Bill
# ==========================
@router.put("/{bill_id}")
def update_bill(
    bill_id: str,
    bill: Bill,
    current_user: dict = Depends(get_current_user)
):
    result = update_bill_service(
        bill_id=bill_id,
        bill_data=bill.dict(),
        user_email=current_user["sub"]
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found."
        )

    return result


# ==========================
# Delete Bill
# ==========================
@router.delete("/{bill_id}")
def delete_bill(
    bill_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = delete_bill_service(
        bill_id=bill_id,
        user_email=current_user["sub"]
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Bill not found."
        )

    return result