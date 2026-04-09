from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional

class InventoryItemBase(BaseModel):
    item_name: str
    current_stock: int = 0
    unit_cost: float

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItem(InventoryItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class InventoryTransactionBase(BaseModel):
    item_id: int
    program_id: Optional[int] = None
    quantity: int
    transaction_type: str  # Enum: Issue, Return
    transaction_date: date

class InventoryTransactionCreate(InventoryTransactionBase):
    pass

class InventoryTransaction(InventoryTransactionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
