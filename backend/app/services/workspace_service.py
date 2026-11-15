from datetime import datetime
from bson import ObjectId
from app.database.connection import database
from app.responses.api_response import success_response
from app.exceptions.custom_exceptions import ResourceNotFoundException

workspaces_collection = database["workspaces"]
wallets_collection = database["wallets"]


def serialize_workspace(ws):
    if not ws:
        return None
    ws["_id"] = str(ws["_id"])
    return ws


def ensure_default_workspace(user_email: str):
    """
    Ensure the user has at least one default 'Personal Finances' workspace.
    """
    existing = workspaces_collection.find_one({"owner_email": user_email})
    if not existing:
        default_ws = {
            "name": "Personal Finances",
            "type": "personal",
            "description": "Default personal expenses and bills folder",
            "icon": "User",
            "color": "#365314",
            "owner_email": user_email,
            "members": [user_email],
            "is_default": True,
            "created_at": datetime.utcnow().isoformat(),
        }
        res = workspaces_collection.insert_one(default_ws)
        default_ws["_id"] = res.inserted_id
        return serialize_workspace(default_ws)
    return None


def get_user_workspaces_service(user_email: str):
    ensure_default_workspace(user_email)
    
    workspaces = []
    # User owns or is a member of
    query = {
        "$or": [
            {"owner_email": user_email},
            {"members": user_email}
        ]
    }
    
    for doc in workspaces_collection.find(query).sort("created_at", 1):
        workspaces.append(serialize_workspace(doc))
        
    return success_response(
        message="Workspaces fetched successfully",
        data=workspaces
    )


def create_workspace_service(workspace_data: dict, user_email: str):
    workspace_data["owner_email"] = user_email
    workspace_data["created_at"] = datetime.utcnow().isoformat()
    if not workspace_data.get("members"):
        workspace_data["members"] = [user_email]
    elif user_email not in workspace_data["members"]:
        workspace_data["members"].append(user_email)
        
    res = workspaces_collection.insert_one(workspace_data)
    workspace_id = str(res.inserted_id)
    
    # If this is a corporate or business workspace, automatically create a linked Corporate Wallet!
    created_wallet_id = None
    if workspace_data.get("type") in ["corporate", "business"]:
        wallet_doc = {
            "name": f"{workspace_data.get('name')} Operations Wallet",
            "workspace_id": workspace_id,
            "balance": 0.0,
            "total_allocated": 0.0,
            "total_spent": 0.0,
            "currency": "INR",
            "manager_email": user_email,
            "allowed_members": workspace_data.get("members", [user_email]),
            "created_at": datetime.utcnow().isoformat(),
        }
        w_res = wallets_collection.insert_one(wallet_doc)
        created_wallet_id = str(w_res.inserted_id)

    return success_response(
        message="Workspace created successfully",
        data={
            "workspace_id": workspace_id,
            "wallet_id": created_wallet_id,
            "name": workspace_data.get("name")
        }
    )


def delete_workspace_service(workspace_id: str, user_email: str):
    ws = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_email": user_email
    })
    
    if not ws:
        raise ResourceNotFoundException("Workspace not found or unauthorized")
        
    if ws.get("is_default"):
        return success_response(
            message="Cannot delete default workspace",
            data={"deleted": False}
        )
        
    workspaces_collection.delete_one({"_id": ObjectId(workspace_id)})
    # Clean up linked wallets
    wallets_collection.delete_many({"workspace_id": workspace_id})
    
    return success_response(
        message="Workspace deleted successfully",
        data={"deleted": True}
    )


def invite_member_service(workspace_id: str, member_email: str, user_email: str):
    ws = workspaces_collection.find_one({
        "_id": ObjectId(workspace_id),
        "owner_email": user_email
    })
    
    if not ws:
        raise ResourceNotFoundException("Workspace not found or unauthorized")
        
    member_email_clean = member_email.strip().lower()
    workspaces_collection.update_one(
        {"_id": ObjectId(workspace_id)},
        {"$addToSet": {"members": member_email_clean}}
    )
    # Also grant access to linked wallets
    wallets_collection.update_many(
        {"workspace_id": workspace_id},
        {"$addToSet": {"allowed_members": member_email_clean}}
    )
    
    return success_response(
        message=f"Invited {member_email_clean} to workspace",
        data={"workspace_id": workspace_id, "member_email": member_email_clean}
    )
