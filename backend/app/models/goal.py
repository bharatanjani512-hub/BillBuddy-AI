from pydantic import BaseModel, Field


class Goal(BaseModel):
    title: str = Field(..., min_length=3)
    target_amount: float = Field(..., gt=0)
    saved_amount: float = Field(default=0, ge=0)
    target_date: str