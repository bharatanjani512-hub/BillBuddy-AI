from typing import Optional

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    monthly_income: float
    currency: str = "INR"


class LoginUser(BaseModel):
    email: EmailStr
    password: str


class BudgetUpdate(BaseModel):
    monthly_budget: float