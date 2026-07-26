from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.exceptions.custom_exceptions import ResourceNotFoundException
from app.models.goal import Goal
from app.services.goal_service import (
    create_goal_service,
    get_goals_service,
    update_goal_service,
    delete_goal_service,
)

router = APIRouter()


# ==========================
# Create Goal
# ==========================
@router.post("/")
def create_goal(
    goal: Goal,
    current_user: dict = Depends(get_current_user)
):
    return create_goal_service(
        goal_data=goal.model_dump(),
        user_email=current_user["sub"]
    )


# ==========================
# Get Goals
# ==========================
@router.get("/")
def get_goals(
    current_user: dict = Depends(get_current_user)
):
    return get_goals_service(
        user_email=current_user["sub"]
    )


# ==========================
# Update Goal
# ==========================
@router.put("/{goal_id}")
def update_goal(
    goal_id: str,
    goal: Goal,
    current_user: dict = Depends(get_current_user)
):
    result = update_goal_service(
        goal_id=goal_id,
        goal_data=goal.model_dump(),
        user_email=current_user["sub"]
    )

    if result is None:
        raise ResourceNotFoundException("Goal")

    return result


# ==========================
# Delete Goal
# ==========================
@router.delete("/{goal_id}")
def delete_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = delete_goal_service(
        goal_id=goal_id,
        user_email=current_user["sub"]
    )

    if result is None:
        raise ResourceNotFoundException("Goal")

    return result