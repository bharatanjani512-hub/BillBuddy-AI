from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.database.connection import database
from app.models.user import User, BudgetUpdate
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_access_token,
    oauth2_scheme,
)

router = APIRouter()

users_collection = database["users"]


@router.get("/")
def get_users():
    users = []

    for user in users_collection.find():
        user["_id"] = str(user["_id"])
        users.append(user)

    return users


@router.post("/register")
def register_user(user: User):

    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    user_dict = user.dict()
    if not user_dict.get("full_name") and user_dict.get("name"):
        user_dict["full_name"] = user_dict["name"]

    user_dict["password"] = hash_password(user.password)

    # Default value for new users
    user_dict["monthly_budget"] = 0

    users_collection.insert_one(user_dict)

    return {
        "message": "User Registered Successfully"
    }


@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    existing_user = users_collection.find_one(
        {"email": form_data.username}
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    if not verify_password(
        form_data.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password."
        )

    access_token = create_access_token(
        data={"sub": existing_user["email"]}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    email = payload.get("sub")
    user_record = users_collection.find_one({"email": email}) if email else None
    name = "User"
    if user_record:
        name = user_record.get("full_name") or user_record.get("name") or email.split("@")[0]

    return {
        "message": "Token is valid",
        "payload": {
            "sub": email,
            "email": email,
            "name": name,
        }
    }


@router.patch("/budget")
def update_monthly_budget(
    budget: BudgetUpdate,
    token: str = Depends(oauth2_scheme)
):

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    email = payload["sub"]

    result = users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "monthly_budget": budget.monthly_budget
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "message": "Monthly budget updated successfully.",
        "monthly_budget": budget.monthly_budget
    }

@router.get("/budget")
def get_monthly_budget(
    token: str = Depends(oauth2_scheme)
):

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    email = payload["sub"]

    user = users_collection.find_one(
        {"email": email},
        {
            "_id": 0,
            "monthly_budget": 1
        }
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return {
        "monthly_budget": user.get("monthly_budget", 0)
    }