from pydantic import BaseModel, Field
from typing import Optional


class Budget(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)

    category: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )

    amount: float = Field(
        ...,
        gt=0,
    )

    month: int = Field(
        ...,
        ge=1,
        le=12,
    )

    year: int = Field(
        ...,
        ge=2024,
        le=2100,
    )

    notes: Optional[str] = Field(
        default="",
        max_length=500,
    )