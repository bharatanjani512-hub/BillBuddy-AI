from typing import Optional
from pydantic import BaseModel, EmailStr


class User(BaseModel):
    full_name: Optional[str] = None
    name: Optional[str] = None
    email: EmailStr
    password: str
    monthly_income: Optional[float] = 0.0
    currency: str = "INR"


class LoginUser(BaseModel):
    email: EmailStr
    password: str


class BudgetUpdate(BaseModel):
    monthly_budget: float
