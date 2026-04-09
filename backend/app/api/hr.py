from fastapi import APIRouter, HTTPException, Depends
from app.core.supabase import get_supabase
from app.schemas.hr import EmployeeProfile, EmployeeProfileCreate, AttendanceLog, AttendanceLogCreate, PayrollLedger
from typing import List, Optional
from datetime import date
from supabase import Client
from app.core.security import check_user_role, get_current_user

router = APIRouter(dependencies=[Depends(check_user_role(["Admin"]))])


@router.get("/employees", response_model=List[EmployeeProfile])
async def get_employees(supabase: Client = Depends(get_supabase)):
    response = supabase.table("employee_profile").select("*").execute()
    return response.data

@router.post("/employees", response_model=EmployeeProfile)
async def create_employee(employee: EmployeeProfileCreate, supabase: Client = Depends(get_supabase)):
    response = supabase.table("employee_profile").insert(employee.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create employee")
    return response.data[0]

@router.put("/employees/{employee_id}", response_model=EmployeeProfile)
async def update_employee(employee_id: int, employee: EmployeeProfileCreate, supabase: Client = Depends(get_supabase)):
    response = supabase.table("employee_profile").update(employee.model_dump()).eq("id", employee_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Employee not found")
    return response.data[0]

@router.get("/attendance", response_model=List[AttendanceLog])
async def get_attendance(target_date: Optional[date] = None, supabase: Client = Depends(get_supabase)):
    query = supabase.table("attendance_log").select("*")
    if target_date:
        query = query.eq("target_date", str(target_date))
    response = query.execute()
    return response.data

@router.post("/attendance", response_model=AttendanceLog)
async def log_attendance(attendance: AttendanceLogCreate, supabase: Client = Depends(get_supabase)):
    response = supabase.table("attendance_log").insert(attendance.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to log attendance")
    return response.data[0]

@router.post("/attendance/lock")
async def lock_attendance(target_date: date, supabase: Client = Depends(get_supabase)):
    response = supabase.table("attendance_log").update({"is_locked": True}).eq("target_date", str(target_date)).execute()
    return {"message": "Attendance locked", "data": response.data}

@router.get("/payroll", response_model=List[PayrollLedger])
async def get_payroll(month: int, year: int, supabase: Client = Depends(get_supabase)):
    response = supabase.table("payroll_ledger").select("*").eq("payroll_month", month).eq("payroll_year", year).execute()
    return response.data
