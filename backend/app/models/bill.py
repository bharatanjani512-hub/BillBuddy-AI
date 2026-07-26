from pydantic import BaseModel
from typing import Optional


class Bill(BaseModel):
    title: str
    amount: float
    category: str
    date: str
    merchant: str
    payment_mode: str
    notes: Optional[str] = None