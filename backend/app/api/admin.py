from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from supabase import Client
from app.core.supabase import get_supabase
from app.core.security import require_permission

router = APIRouter()

@router.get("/audit-logs")
async def get_audit_logs(
    limit: int = 50,
    user = Depends(require_permission('audit:read')),
    supabase: Client = Depends(get_supabase)
):
    try:
        response = supabase.table("system_audit_logs") \
            .select("*, users(email, roles(role_name))") \
            .order("timestamp", desc=True) \
            .limit(limit) \
            .execute()
        return response.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_system_stats(
    user = Depends(require_permission('admin:users')),
    supabase: Client = Depends(get_supabase)
):
    try:
        # Get users with their roles
        response = supabase.table("users").select("roles(role_name)").execute()
        users = response.data or []
        
        # Aggregate counts
        role_counts = {}
        for u in users:
            role = u.get("roles", {}).get("role_name", "Unknown")
            role_counts[role] = role_counts.get(role, 0) + 1
            
        return {
            "total_users": len(users),
            "role_counts": role_counts,
            "status": "healthy"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
