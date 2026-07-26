from pydantic import BaseModel


class Budget(BaseModel):
    category: str
    budget_amount: float
    month: int
    year: int