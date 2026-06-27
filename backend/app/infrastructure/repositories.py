from app.domain.entities import User
from supabase import Client

class SupabaseUserRepository:
    def __init__(self, supabase_client: Client):
        self.client = supabase_client

    def register(self, email: str, password: str, role_id: int) -> User:
        auth_response = self.client.auth.sign_up({
            "email": email,
            "password": password
        })
        if not auth_response.user:
            raise Exception("Registration failed at Auth provider")
        
        self.client.table("users").insert({
            "id": auth_response.user.id,
            "email": email,
            "role_id": role_id
        }).execute()
        
        return User(id=auth_response.user.id, email=email, role_id=role_id)

    def login(self, email: str, password: str) -> tuple[str, str, User]:
        auth_response = self.client.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        if not auth_response.session:
            raise Exception("Invalid credentials")
            
        user_id = auth_response.user.id
        db_user = self.client.table("users").select("*, roles(role_name)").eq("id", user_id).single().execute()
        
        role_name = "Director"
        if db_user.data and "roles" in db_user.data and db_user.data["roles"]:
            role_name = db_user.data["roles"].get("role_name", "Director")
            
        user = User(
            id=user_id,
            email=email,
            role_id=db_user.data.get("role_id") if db_user.data else None,
            role_name=role_name
        )
        return auth_response.session.access_token, auth_response.session.refresh_token, user
