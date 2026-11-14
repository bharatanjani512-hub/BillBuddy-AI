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
