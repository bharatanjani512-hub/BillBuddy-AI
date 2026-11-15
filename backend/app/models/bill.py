from pydantic import BaseModel, Field
from typing import Optional


class Bill(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=50)
    date: str
    merchant: str
    payment_mode: str = "Cash"
    notes: Optional[str] = None

    status: str = "Paid"  # "Paid" | "Pending" | "Unpaid"
    currency: str = "INR"
    due_date: Optional[str] = None  # YYYY-MM-DD
    is_recurring: Optional[bool] = False
    auto_pay: Optional[bool] = False

    # Multi-Workspace / Corporate Support
    workspace_id: Optional[str] = None
    folder_name: Optional[str] = None
    wallet_id: Optional[str] = None
    is_corporate: Optional[bool] = False
    submitted_by: Optional[str] = None
    approval_status: Optional[str] = "approved"  # "approved" | "pending_approval" | "rejected"
