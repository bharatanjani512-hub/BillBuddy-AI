from pydantic import BaseModel


class BudgetCreate(BaseModel):
    monthly_budget: float


class BudgetResponse(BaseModel):
    monthly_budget: float
    currency: str