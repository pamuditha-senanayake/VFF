from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.core.supabase import get_supabase
from supabase import Client
from typing import Optional
from app.infrastructure.repositories import SupabaseUserRepository
from app.application.use_cases import RegisterUseCase, LoginUseCase

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role_id: Optional[int] = 2  # Default to 'Director' (id: 2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(user_data: UserRegister, supabase: Client = Depends(get_supabase)):
    try:
        repository = SupabaseUserRepository(supabase)
        use_case = RegisterUseCase(repository)
        user = use_case.execute(user_data.email, user_data.password, user_data.role_id)
        return {"message": "User registered successfully", "user_id": user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user_data: UserLogin, supabase: Client = Depends(get_supabase)):
    try:
        repository = SupabaseUserRepository(supabase)
        use_case = LoginUseCase(repository)
        access_token, refresh_token, user = use_case.execute(user_data.email, user_data.password)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role_name
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

class UpdateRoleRequest(BaseModel):
    role_id: int

@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, data: UpdateRoleRequest, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("users").update({"role_id": data.role_id}).eq("id", user_id).execute()
        return {"message": "User role updated successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users")
async def get_users(supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("users").select("*, roles(role_name)").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
