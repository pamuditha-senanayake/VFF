from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import date
from calendar import monthrange
from supabase import Client

# Internal App Imports
from app.core.supabase import get_supabase
from app.core.security import require_permission
from app.schemas.finance import (
    FinancialTransaction,
    FinancialTransactionCreate,
    Program,
    ProgramCreate
)

router = APIRouter()

# ==========================================
# 1. TRANSACTIONS (The Immutable Ledger)
# ==========================================

@router.get("/transactions", response_model=List[FinancialTransaction])
async def get_transactions(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    user = Depends(require_permission('finance:read')), # SECURED
    supabase: Client = Depends(get_supabase)
):
    query = supabase.table("financial_transactions").select("*, programs(program_name)")

    if start_date:
        query = query.gte("transaction_date", str(start_date))
    if end_date:
        query = query.lte("transaction_date", str(end_date))

    response = query.order("transaction_date", desc=True).execute()
    return response.data or []


@router.post("/transactions", response_model=FinancialTransaction)
async def create_transaction(
    transaction: FinancialTransactionCreate,
    user = Depends(require_permission('finance:write')),
    supabase: Client = Depends(get_supabase)
):
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Transaction amount must be strictly positive.")

    data = transaction.model_dump()
    data["transaction_date"] = str(data["transaction_date"])  # 👈 ADD THIS
    data["amount"] = float(data["amount"])                    # 👈 AND THIS (for Decimal)

    response = supabase.table("financial_transactions").insert(data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create transaction")

    return response.data[0]


@router.get("/transactions/type/{transaction_type}")
async def get_transactions_by_type(
    transaction_type: str,
    user = Depends(require_permission('finance:read')), # SECURED
    supabase: Client = Depends(get_supabase)
):
    transaction_type = transaction_type.capitalize()

    response = supabase.table("financial_transactions") \
        .select("*") \
        .eq("transaction_type", transaction_type) \
        .execute()

    return response.data or []

@router.put("/transactions/{transaction_id}", response_model=FinancialTransaction)
async def update_transaction(
    transaction_id: int,
    transaction: FinancialTransactionCreate,
    user = Depends(require_permission('finance:write')),
    supabase: Client = Depends(get_supabase)
):
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Transaction amount must be strictly positive.")

    data = transaction.model_dump()
    data["transaction_date"] = str(data["transaction_date"])
    data["amount"] = float(data["amount"])

    response = supabase.table("financial_transactions") \
        .update(data) \
        .eq("id", transaction_id) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return response.data[0]


@router.patch("/transactions/{transaction_id}/void", response_model=FinancialTransaction)
async def void_transaction(
    transaction_id: int,
    user = Depends(require_permission('finance:write')),
    supabase: Client = Depends(get_supabase)
):
    # Check it exists and isn't already voided
    existing = supabase.table("financial_transactions") \
        .select("*") \
        .eq("id", transaction_id) \
        .single() \
        .execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if existing.data.get("status") == "Voided":
        raise HTTPException(status_code=400, detail="Transaction is already voided")

    response = supabase.table("financial_transactions") \
        .update({"status": "Voided"}) \
        .eq("id", transaction_id) \
        .execute()

    return response.data[0]

@router.patch("/transactions/{transaction_id}/settle", response_model=FinancialTransaction)
async def settle_transaction(
    transaction_id: int,
    user = Depends(require_permission('finance:write')),
    supabase: Client = Depends(get_supabase)
):
    existing = supabase.table("financial_transactions") \
        .select("*") \
        .eq("id", transaction_id) \
        .single() \
        .execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if existing.data.get("status") == "Cash":
        raise HTTPException(status_code=400, detail="Transaction is already settled")

    response = supabase.table("financial_transactions") \
        .update({"status": "Cash"}) \
        .eq("id", transaction_id) \
        .execute()

    return response.data[0]


# ==========================================
# 2. PROGRAMS
# ==========================================

@router.get("/programs", response_model=List[Program])
async def get_programs(
    user = Depends(require_permission('programs:read')), # SECURED
    supabase: Client = Depends(get_supabase)
):
    response = supabase.table("programs").select("*").execute()
    return response.data or []


@router.post("/programs", response_model=Program)
async def create_program(
    program: ProgramCreate,
    user = Depends(require_permission('programs:manage')), # SECURED
    supabase: Client = Depends(get_supabase)
):
    response = supabase.table("programs").insert(program.model_dump()).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create program")

    return response.data[0]


# ==========================================
# 3. FINANCIAL SUMMARIES (Optimized)
# ==========================================

@router.get("/summary")
async def get_financial_summary(
    user = Depends(require_permission('finance:read')),
    supabase: Client = Depends(get_supabase)
):
    # Fetch all transactions to compute summary
    response = supabase.table("financial_transactions").select("amount, transaction_type, status").execute()
    transactions = response.data or []
    
    cash_available = 0
    receivables = 0
    monthly_expenses = 0 # Approximated from all expenses for this simple summary
    
    for t in transactions:
        amt = float(t["amount"])
        if t["transaction_type"] == "Income":
            if t["status"] == "Cash":
                cash_available += amt
            elif t["status"] == "Receivable":
                receivables += amt
        elif t["transaction_type"] == "Expense":
            monthly_expenses += amt
            if t["status"] == "Cash":
                cash_available -= amt
                
    return {
        "cash_available": cash_available,
        "receivables": receivables,
        "monthly_expenses": monthly_expenses
    }

@router.get("/aging")
async def get_aging_summary(
    user = Depends(require_permission('finance:read')),
    supabase: Client = Depends(get_supabase)
):
    response = supabase.table("financial_transactions") \
        .select("*") \
        .eq("status", "Receivable") \
        .execute()
    
    transactions = response.data or []
    from datetime import datetime
    today = datetime.now().date()
    
    aging = {
        "0-30": 0,
        "31-60": 0,
        "61+": 0
    }
    
    for t in transactions:
        t_date = datetime.strptime(t["transaction_date"], "%Y-%m-%d").date()
        days = (today - t_date).days
        amt = float(t["amount"])
        
        if days <= 30:
            aging["0-30"] += amt
        elif days <= 60:
            aging["31-60"] += amt
        else:
            aging["61+"] += amt
            
    return aging


@router.get("/summary/monthly")
async def monthly_summary(
    month: int,
    year: int,
    user = Depends(require_permission('finance:read')), # SECURED
    supabase: Client = Depends(get_supabase)
):
    # Big-O Optimization: Database-level filtering
    _, last_day = monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    response = supabase.table("financial_transactions") \
        .select("amount, transaction_type") \
        .gte("transaction_date", str(start_date)) \
        .lte("transaction_date", str(end_date)) \
        .execute()
        
    transactions = response.data or []

    total_income = sum(t["amount"] for t in transactions if t["transaction_type"].lower() == "income")
    total_expense = sum(t["amount"] for t in transactions if t["transaction_type"].lower() == "expense")

    return {
        "month": month,
        "year": year,
        "income": total_income,
        "expense": total_expense,
        "balance": total_income - total_expense
    }


# ==========================================
# 4. CROSS-MODULE PAYROLL ENGINE
# ==========================================

@router.post("/calculate-payroll/{year}/{month}")
async def calculate_monthly_payroll(
    year: int,
    month: int,
    user = Depends(require_permission('payroll:generate')), # SECURED
    supabase: Client = Depends(get_supabase)
):
    # 1. Date boundaries
    _, last_day = monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    # 2. Fetch LOCKED HR attendance logs + base salary (Cross-Module DB Join)
    attendance_response = supabase.table("attendance_logs") \
        .select("employee_id, worked_hours, employee_profiles(base_salary)") \
        .gte("target_date", str(start_date)) \
        .lte("target_date", str(end_date)) \
        .eq("is_locked", True) \
        .execute()

    if not attendance_response.data:
        raise HTTPException(status_code=404, detail="No locked attendance records found for this month.")

    # 3. Aggregate hours and calculate pay
    payroll_data = {}
    for log in attendance_response.data:
        emp_id = log["employee_id"]
        hours = float(log.get("worked_hours", 0))
        base_rate = float(log["employee_profiles"]["base_salary"]) 

        if emp_id not in payroll_data:
            payroll_data[emp_id] = {"total_hours": 0, "rate": base_rate}
        
        payroll_data[emp_id]["total_hours"] += hours

    processed_count = 0
    total_payroll_expense = 0

    # 4. Post to Payroll Ledger
    for emp_id, data in payroll_data.items():
        net_payable = data["total_hours"] * data["rate"]
        if net_payable <= 0:
            continue

        supabase.table("payroll_ledgers").insert({
            "employee_id": emp_id,
            "payroll_month": month,
            "payroll_year": year,
            "net_payable": net_payable
        }).execute()

        total_payroll_expense += net_payable
        processed_count += 1

    # 5. Automatically deduct from main charity financial ledger
    if total_payroll_expense > 0:
        supabase.table("financial_transactions").insert({
            "transaction_date": str(date.today()),
            "amount": total_payroll_expense,
            "transaction_type": "Expense",
            "status": "Cash"
        }).execute()

    return {
        "message": f"Successfully processed payroll for {processed_count} employees.",
        "month": month,
        "year": year,
        "total_payout": total_payroll_expense
    }