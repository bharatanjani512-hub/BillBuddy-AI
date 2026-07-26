from bson import ObjectId

from app.database.connection import database
from app.responses.api_response import success_response

goals_collection = database["goals"]


# ==========================
# Create Goal
# ==========================
def create_goal_service(
    goal_data: dict,
    user_email: str
):
    goal_data["user_email"] = user_email

    goals_collection.insert_one(goal_data)

    return success_response(
        message="Goal Created Successfully",
        data={
            "user": user_email
        }
    )


# ==========================
# Get Goals
# ==========================
def get_goals_service(
    user_email: str
):
    goals = []

    for goal in goals_collection.find(
        {"user_email": user_email}
    ):
        goal["_id"] = str(goal["_id"])

        # Hide internal field
        goal.pop("user_email", None)

        goals.append(goal)

    return success_response(
        message="Goals fetched successfully",
        data=goals
    )


# ==========================
# Get Goal By ID
# ==========================
def get_goal_by_id_service(
    goal_id: str,
    user_email: str
):
    return goals_collection.find_one(
        {
            "_id": ObjectId(goal_id),
            "user_email": user_email
        }
    )


# ==========================
# Update Goal
# ==========================
def update_goal_service(
    goal_id: str,
    goal_data: dict,
    user_email: str
):
    existing_goal = get_goal_by_id_service(
        goal_id,
        user_email
    )

    if existing_goal is None:
        return None

    goal_data["user_email"] = user_email

    goals_collection.update_one(
        {
            "_id": ObjectId(goal_id)
        },
        {
            "$set": goal_data
        }
    )

    return success_response(
        message="Goal Updated Successfully"
    )


# ==========================
# Delete Goal
# ==========================
def delete_goal_service(
    goal_id: str,
    user_email: str
):
    existing_goal = get_goal_by_id_service(
        goal_id,
        user_email
    )

    if existing_goal is None:
        return None

    goals_collection.delete_one(
        {
            "_id": ObjectId(goal_id)
        }
    )

    return success_response(
        message="Goal Deleted Successfully"
    )