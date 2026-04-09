from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional, List

class RoleBase(BaseModel):
    role_name: str

class Role(RoleBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class EmployeeProfileBase(BaseModel):
    first_name: str
    last_name: str
    nic: str
    base_salary: float
    status: str = "Active"
    user_id: Optional[str] = None

class EmployeeProfileCreate(EmployeeProfileBase):
    pass

class EmployeeProfile(EmployeeProfileBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AttendanceLogBase(BaseModel):
    employee_id: int
    target_date: date
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None
    worked_hours: Optional[float] = None
    is_locked: bool = False

class AttendanceLogCreate(AttendanceLogBase):
    pass

class AttendanceLog(AttendanceLogBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class PayrollLedgerBase(BaseModel):
    employee_id: int
    payroll_month: int
    payroll_year: int
    net_payable: float

class PayrollLedger(PayrollLedgerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
