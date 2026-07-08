from pydantic import BaseModel, ConfigDict, Field
from datetime import date
from typing import Optional
from decimal import Decimal
from enum import Enum

# --- Program Schemas ---
class ProgramBase(BaseModel):
    program_name: str
    total_animals_treated: int = 0
    status: str = "Active"

class ProgramCreate(ProgramBase):
    pass

class Program(ProgramBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Enums (matching DB values exactly) ---
class TransactionType(str, Enum):
    INCOME = "Income"
    EXPENSE = "Expense"

class TransactionStatus(str, Enum):
    CASH = "Cash"
    RECEIVABLE = "Receivable"
    VOIDED = "Voided"

# --- Financial Transaction Schemas ---
class FinancialTransactionBase(BaseModel):
    transaction_date: date
    amount: Decimal = Field(..., max_digits=12, decimal_places=2)
    transaction_type: TransactionType
    status: TransactionStatus
    program_id: Optional[int] = None

class FinancialTransactionCreate(FinancialTransactionBase):
    pass

# Add this tiny class right above your FinancialTransaction class
class LinkedProgram(BaseModel):
    program_name: str

# Update your existing response model to include the linked program
class FinancialTransaction(FinancialTransactionBase):
    id: int
    programs: Optional[LinkedProgram] = None  # This catches the joined data!
    
    model_config = ConfigDict(
        from_attributes=True, 
        json_encoders={Decimal: float}
    )