from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Protocol

class User(BaseModel):
    id: str = Field(..., min_length=1)
    email: EmailStr
    role_id: Optional[int] = 2
    role_name: Optional[str] = None

class UserRepository(Protocol):
    def register(self, email: str, password: str, role_id: int) -> User:
        """Register a user."""
        ...

    def login(self, email: str, password: str) -> tuple[str, str, User]:
        """Authenticate user."""
        ...
