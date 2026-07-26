from fastapi import APIRouter, Depends, HTTPException

from app.schemas.budget import BudgetCreate
from app.services.budget_service import (
    save_budget,
    get_budget,
    get_current_month_expense
)

from app.dependencies.auth import get_current_user

router = APIRouter()


# -------------------------
# Set Monthly Budget
# -------------------------
@router.post("/")
def set_budget(
    budget: BudgetCreate,
    current_user: dict = Depends(get_current_user)
):
    user_email = current_user["sub"]

    save_budget(
        user_email=user_email,
        monthly_budget=budget.monthly_budget
    )

    return {
        "message": "Monthly budget saved successfully."
    }


# -------------------------
# View Budget
# -------------------------
@router.get("/")
def view_budget(
    current_user: dict = Depends(get_current_user)
):
    user_email = current_user["sub"]

    budget = get_budget(user_email)

    if budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found."
        )

    return budget


# -------------------------
# Budget Summary
# -------------------------
@router.get("/summary")
def budget_summary(
    current_user: dict = Depends(get_current_user)
):
    user_email = current_user["sub"]

    budget = get_budget(user_email)

    if budget is None:
        raise HTTPException(
            status_code=404,
            detail="Budget not found."
        )

    monthly_budget = budget["monthly_budget"]
    currency = budget.get("currency", "INR")

    spent_this_month = get_current_month_expense(user_email)

    remaining_budget = monthly_budget - spent_this_month

    usage_percentage = (
        (spent_this_month / monthly_budget) * 100
        if monthly_budget > 0
        else 0
    )

    if usage_percentage < 50:
        status = "Excellent"

    elif usage_percentage < 80:
        status = "Safe"

    elif usage_percentage <= 100:
        status = "Warning"

    else:
        status = "Exceeded"

    return {
        "monthly_budget": monthly_budget,
        "spent_this_month": spent_this_month,
        "remaining_budget": remaining_budget,
        "usage_percentage": round(usage_percentage, 2),
        "status": status,
        "currency": currency
    }