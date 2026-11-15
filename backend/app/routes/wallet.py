from fastapi import APIRouter, Depends, Query
from app.dependencies.auth import get_current_user
from app.models.wallet import Wallet, AddFundsRequest
from app.services.wallet_service import (
    get_wallets_service,
    get_wallet_by_id_service,
    create_wallet_service,
    add_funds_service,
)

router = APIRouter()


@router.get("/")
def get_wallets(
    workspace_id: str | None = None,
    current_user: dict = Depends(get_current_user)
):
    return get_wallets_service(
        user_email=current_user["sub"],
        workspace_id=workspace_id
    )


@router.get("/{wallet_id}")
def get_wallet(
    wallet_id: str,
    current_user: dict = Depends(get_current_user)
):
    return get_wallet_by_id_service(
        wallet_id=wallet_id,
        user_email=current_user["sub"]
    )


@router.post("/")
def create_wallet(
    wallet: Wallet,
    current_user: dict = Depends(get_current_user)
):
    return create_wallet_service(
        wallet_data=wallet.dict(),
        user_email=current_user["sub"]
    )


@router.post("/{wallet_id}/add-funds")
def add_funds(
    wallet_id: str,
    payload: AddFundsRequest,
    current_user: dict = Depends(get_current_user)
):
    return add_funds_service(
        wallet_id=wallet_id,
        amount=payload.amount,
        notes=payload.notes,
        user_email=current_user["sub"]
    )
