from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.supabase import get_supabase
from supabase import Client

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), supabase: Client = Depends(get_supabase)):
    token = credentials.credentials
    try:
        # Verify token with Supabase
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        # Fetch user role from our database
        user_id = user_response.user.id
        db_user = supabase.table("users").select("*, roles(role_name)").eq("id", user_id).single().execute()
        
        if not db_user.data:
            # If user exists in Auth but not in our table, we might need to sync
            # For now, reject
            raise HTTPException(status_code=403, detail="User record not found in system")
            
        return db_user.data
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

def check_user_role(allowed_roles: list[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        role_name = (current_user.get("roles", {}).get("role_name") or "").lower()
        if role_name not in [r.lower() for r in allowed_roles]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

