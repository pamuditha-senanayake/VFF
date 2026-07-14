from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.supabase import get_supabase
from supabase import Client
from app.core.permissions import has_permission

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), supabase: Client = Depends(get_supabase)):
    token = credentials.credentials
    try:
        user_response = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")

    if not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = user_response.user.id
    try:
        db_user = supabase.table("users").select("*, roles(role_name)").eq("id", user_id).single().execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database lookup failed: {str(e)}")

    if not db_user.data:
        raise HTTPException(status_code=403, detail="User record not found in system")

    return db_user.data

def check_user_role(allowed_roles: list[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        role_name = (current_user.get("roles", {}).get("role_name") or "").lower()
        if role_name not in [r.lower() for r in allowed_roles]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker

def require_permission(permission: str):
    async def permission_checker(current_user: dict = Depends(get_current_user)):
        role_name = (current_user.get("roles", {}).get("role_name") or "")
        if not has_permission(role_name, permission):
            raise HTTPException(status_code=403, detail=f"Insufficient permissions. Requires {permission}")
        return current_user
    return permission_checker

