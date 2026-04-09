from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.core.supabase import get_supabase
from supabase import Client
from typing import Optional

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
        # 1. Register in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": str(user_data.email),
            "password": user_data.password
        })


        
        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed at Auth provider")
        
        # 2. Add to our local users table
        # We use a try-except here because the user might already exist in auth but not in our table
        # though normally signUp handles that.
        supabase.table("users").insert({
            "id": auth_response.user.id,
            "email": user_data.email,
            "role_id": user_data.role_id
        }).execute()
        
        return {"message": "User registered successfully", "user_id": auth_response.user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user_data: UserLogin, supabase: Client = Depends(get_supabase)):
    try:
        # 1. Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": str(user_data.email),
            "password": user_data.password
        })


        
        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # 2. Fetch role for frontend convenience
        user_id = auth_response.user.id
        db_user = supabase.table("users").select("*, roles(role_name)").eq("id", user_id).single().execute()
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": {
                "id": user_id,
                "email": user_data.email,
                "role": db_user.data.get("roles", {}).get("role_name") if db_user.data else "Director"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
