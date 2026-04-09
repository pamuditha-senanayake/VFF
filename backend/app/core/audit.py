from typing import Any, Optional
from supabase import Client
from datetime import datetime
import json

async def log_audit_action(
    supabase: Client,
    user_id: Optional[str],
    action_type: str,
    table_name: str,
    old_payload: Optional[Any] = None,
    new_payload: Optional[Any] = None
):
    try:
        supabase.table("system_audit_logs").insert({
            "user_id": user_id,
            "action_type": action_type,
            "table_name": table_name,
            "old_payload": old_payload,
            "new_payload": new_payload,
            "timestamp": datetime.now().isoformat()
        }).execute()
    except Exception as e:
        print(f"Failed to log audit action: {e}")
        # We don't want to crash the request if audit logging fails
