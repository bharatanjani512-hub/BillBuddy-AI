from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.budget import Budget
from app.dependencies.auth import get_current_user
from app.services.budget_service import (
    create_budget_service,
    get_budgets_service,
    get_budget_statistics_service,
    get_recent_budgets_service,
    update_budget_service,
    delete_budget_service,
)

router = APIRouter()


# ============================================================
# Create Budget Entry
# ============================================================

@router.post("/create")
@router.post("/")
def create_budget(
    budget: Budget,
    current_user: dict = Depends(get_current_user),
):
    return create_budget_service(
        user_email=current_user["sub"],
        budget_data=budget.dict(),
    )


# ============================================================
# Budget Summary
# ============================================================

@router.get("/summary")
def get_budget_summary(
    current_user: dict = Depends(get_current_user),
):
    return get_budget_statistics_service(user_email=current_user["sub"])


# ============================================================
# List Budgets (paginated)
# ============================================================

@router.get("/")
def list_budgets(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category: str | None = None,
    month: int | None = None,
    year: int | None = None,
    sort: str = "latest",
    current_user: dict = Depends(get_current_user),
):
    return get_budgets_service(
        user_email=current_user["sub"],
        page=page,
        limit=limit,
        category=category,
        month=month,
        year=year,
        sort=sort,
    )


# ============================================================
# Budget Statistics
# ============================================================

@router.get("/statistics")
def budget_statistics(
    current_user: dict = Depends(get_current_user),
):
    return get_budget_statistics_service(user_email=current_user["sub"])


# ============================================================
# Recent Budgets
# ============================================================

@router.get("/recent")
def recent_budgets(
    current_user: dict = Depends(get_current_user),
):
    return get_recent_budgets_service(user_email=current_user["sub"])


# ============================================================
# Update Budget
# ============================================================

@router.put("/{budget_id}")
def update_budget(
    budget_id: str,
    budget: Budget,
    current_user: dict = Depends(get_current_user),
):
    result = update_budget_service(
        user_email=current_user["sub"],
        budget_id=budget_id,
        budget_data=budget.dict(),
    )
    if result is None:
        raise HTTPException(status_code=404, detail="Budget not found.")
    return result


# ============================================================
# Delete Budget
# ============================================================

@router.delete("/{budget_id}")
def delete_budget(
    budget_id: str,
    current_user: dict = Depends(get_current_user),
):
    result = delete_budget_service(
        user_email=current_user["sub"],
        budget_id=budget_id,
    )
    if result is None:
        raise HTTPException(status_code=404, detail="Budget not found.")
    return result
