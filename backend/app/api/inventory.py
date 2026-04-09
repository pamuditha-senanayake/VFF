from fastapi import APIRouter, HTTPException, Depends
from app.core.supabase import get_supabase
from app.schemas.inventory import InventoryItem, InventoryItemCreate, InventoryTransaction, InventoryTransactionCreate
from typing import List, Optional
from datetime import date
from supabase import Client
from app.core.security import check_user_role

router = APIRouter(dependencies=[Depends(check_user_role(["Admin", "Director"]))])


@router.get("/items", response_model=List[InventoryItem])
async def get_items(supabase: Client = Depends(get_supabase)):
    response = supabase.table("inventory_items").select("*").execute()
    return response.data

@router.post("/items", response_model=InventoryItem)
async def create_item(item: InventoryItemCreate, supabase: Client = Depends(get_supabase)):
    response = supabase.table("inventory_items").insert(item.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create item")
    return response.data[0]

@router.get("/transactions", response_model=List[InventoryTransaction])
async def get_transactions(item_id: Optional[int] = None, supabase: Client = Depends(get_supabase)):
    query = supabase.table("inventory_transactions").select("*, inventory_items(item_name), programs(program_name)")
    if item_id:
        query = query.eq("item_id", item_id)
    response = query.execute()
    return response.data

@router.post("/transactions", response_model=InventoryTransaction)
async def create_transaction(transaction: InventoryTransactionCreate, supabase: Client = Depends(get_supabase)):
    # 1. Start transaction (Supabase doesn't support multi-table atomic transactions easily via client, so we do it step-wise)
    # In a real production app, we should use a Postgres function (RPC) for atomicity.
    
    # Check stock
    item_response = supabase.table("inventory_items").select("current_stock").eq("id", transaction.item_id).single().execute()
    if not item_response.data:
        raise HTTPException(status_code=404, detail="Item not found")
    
    current_stock = item_response.data["current_stock"]
    new_stock = current_stock
    
    if transaction.transaction_type == "Issue":
        if current_stock < transaction.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        new_stock -= transaction.quantity
    elif transaction.transaction_type == "Return":
        new_stock += transaction.quantity
    
    # Update stock
    update_response = supabase.table("inventory_items").update({"current_stock": new_stock}).eq("id", transaction.item_id).execute()
    
    # Log transaction
    response = supabase.table("inventory_transactions").insert(transaction.model_dump()).execute()
    if not response.data:
        # Rollback stock if possible (not ideal, RPC is better)
        supabase.table("inventory_items").update({"current_stock": current_stock}).eq("id", transaction.item_id).execute()
        raise HTTPException(status_code=400, detail="Failed to log inventory transaction")
    
    return response.data[0]
