from app.domain.entities import UserRepository, User

class RegisterUseCase:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def execute(self, email: str, password: str, role_id: int) -> User:
        return self.repository.register(email, password, role_id)

class LoginUseCase:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def execute(self, email: str, password: str) -> tuple[str, str, User]:
        return self.repository.login(email, password)
