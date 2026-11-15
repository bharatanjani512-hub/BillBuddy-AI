from pydantic import BaseModel, Field
from typing import Optional, List


class Wallet(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    workspace_id: str
    balance: float = Field(0.0, ge=0)
    total_allocated: float = Field(0.0, ge=0)
    currency: str = "INR"
    manager_email: Optional[str] = None
    allowed_members: Optional[List[str]] = []
    notes: Optional[str] = None


class AddFundsRequest(BaseModel):
    amount: float = Field(..., gt=0)
    notes: Optional[str] = None
