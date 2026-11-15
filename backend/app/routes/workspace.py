from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from app.dependencies.auth import get_current_user
from app.models.workspace import Workspace
from app.services.workspace_service import (
    get_user_workspaces_service,
    create_workspace_service,
    delete_workspace_service,
    invite_member_service,
)

router = APIRouter()


class InviteRequest(BaseModel):
    member_email: str = Field(..., min_length=3)


@router.get("/")
def get_workspaces(
    current_user: dict = Depends(get_current_user)
):
    return get_user_workspaces_service(
        user_email=current_user["sub"]
    )


@router.post("/")
def create_workspace(
    workspace: Workspace,
    current_user: dict = Depends(get_current_user)
):
    return create_workspace_service(
        workspace_data=workspace.dict(),
        user_email=current_user["sub"]
    )


@router.delete("/{workspace_id}")
def delete_workspace(
    workspace_id: str,
    current_user: dict = Depends(get_current_user)
):
    return delete_workspace_service(
        workspace_id=workspace_id,
        user_email=current_user["sub"]
    )


@router.post("/{workspace_id}/invite")
def invite_member(
    workspace_id: str,
    payload: InviteRequest,
    current_user: dict = Depends(get_current_user)
):
    return invite_member_service(
        workspace_id=workspace_id,
        member_email=payload.member_email,
        user_email=current_user["sub"]
    )
