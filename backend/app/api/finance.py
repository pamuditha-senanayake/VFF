from fastapi import APIRouter, HTTPException, Depends
from app.core.supabase import get_supabase
from app.schemas.finance import FinancialTransaction, FinancialTransactionCreate, Program, ProgramCreate

from typing import List, Optional
from datetime import date
from supabase import Client
from app.core.security import check_user_role

router = APIRouter()


@router.get("/transactions", response_model=List[FinancialTransaction])
async def get_transactions(
    start_date: Optional[date] = None, 
    end_date: Optional[date] = None, 
    supabase: Client = Depends(get_supabase)
):
    query = supabase.table("financial_transactions").select("*, programs(program_name)")
    if start_date:
        query = query.gte("transaction_date", str(start_date))
    if end_date:
        query = query.lte("transaction_date", str(end_date))
    response = query.execute()
    return response.data

@router.post("/transactions", response_model=FinancialTransaction)
async def create_transaction(transaction: FinancialTransactionCreate, supabase: Client = Depends(get_supabase)):
    response = supabase.table("financial_transactions").insert(transaction.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create transaction")
    return response.data[0]

@router.get("/programs", response_model=List[Program])
async def get_programs(supabase: Client = Depends(get_supabase)):
    response = supabase.table("programs").select("*").execute()
    return response.data

@router.post("/programs", response_model=Program)
async def create_program(program: ProgramCreate, supabase: Client = Depends(get_supabase)):
    # program is base model here, but we can use it to create
    response = supabase.table("programs").insert(program.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create program")
    return response.data[0]

