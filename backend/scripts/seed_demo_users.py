import os
import sys
from dotenv import load_dotenv

# Ensure we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
load_dotenv()

from supabase import create_client

def seed_users():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.")
        return
        
    supabase = create_client(supabase_url, supabase_key)
    
    print("Seeding demo users...")
    
    # We define the users to seed
    users = [
        {"email": "admin@vff.test", "role_id": 1, "first": "Admin", "last": "User"},
        {"email": "director@vff.test", "role_id": 2, "first": "Director", "last": "User"},
        {"email": "hr@vff.test", "role_id": 3, "first": "HR", "last": "User"},
        {"email": "finance@vff.test", "role_id": 4, "first": "Finance", "last": "User"},
        {"email": "staff@vff.test", "role_id": 5, "first": "Staff", "last": "User"}
    ]
    
    # In a real environment with the service key, we could use supabase.auth.admin.create_user.
    # Without it, we might just print that they should be manually created if we don't have admin rights.
    # We will attempt to sign up and then manually update their role in the public.users table.
    
    for u in users:
        print(f"Ensuring user {u['email']} exists...")
        try:
            # We use a standard password for demo purposes
            res = supabase.auth.sign_up({
                "email": u["email"],
                "password": "Password123!"
            })
            user_id = res.user.id if res.user else None
        except Exception as e:
            # User might already exist, let's try to fetch them by signing in
            try:
                res = supabase.auth.sign_in_with_password({
                    "email": u["email"],
                    "password": "Password123!"
                })
                user_id = res.user.id
            except Exception as e2:
                print(f"Could not create or login {u['email']}: {e2}")
                continue
                
        if user_id:
            # Update public.users table role
            try:
                # Ensure the user exists in public.users (in case the trigger didn't fire)
                supabase.table("users").upsert({"id": user_id, "email": u["email"], "role_id": u["role_id"]}).execute()
                print(f"  -> Set role_id={u['role_id']} for {u['email']}")
                
                # Ensure employee profile exists
                emp_check = supabase.table("employee_profile").select("id").eq("user_id", user_id).execute()
                if not emp_check.data:
                    supabase.table("employee_profile").insert({
                        "user_id": user_id,
                        "first_name": u["first"],
                        "last_name": u["last"],
                        "nic": f"DEMO{u['role_id']}V",
                        "base_salary": 50000 + (10000 * (6 - u["role_id"])),
                        "status": "Active"
                    }).execute()
                    print(f"  -> Created employee profile for {u['email']}")
            except Exception as e:
                print(f"Failed to update db tables for {u['email']}: {e}")

if __name__ == "__main__":
    seed_users()
