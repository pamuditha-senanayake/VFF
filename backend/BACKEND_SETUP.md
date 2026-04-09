# FastAPI Backend Setup Guide (VFF IMS)

This guide provides instructions for setting up the backend services to integrate with the VFF IMS Frontend.

## Recommended Tech Stack
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy or Tortoise ORM
- **Auth**: JWT (OAuth2 with Password Flow)

## Project Structure

```text
ims-backend/
├── app/
│   ├── api/                # API Endpoints
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── hr.py
│   │   │   ├── finance.py
│   │   │   └── inventory.py
│   ├── core/               # Configuration & Security
│   │   ├── config.py
│   │   └── security.py
│   ├── models/             # Database Schemas (SQLAlchemy)
│   ├── schemas/            # Pydantic Schemas (Validation)
│   ├── crud/               # Database Operations
│   └── main.py             # FastAPI App Entrypoint
├── migrations/             # Alembic Migrations
├── requirements.txt
└── .env
```

## Basic Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install core dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary pydantic[email] python-jose[cryptography] passlib[bcrypt] python-multipart
   ```

3. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Key API Endpoints to Implement

### Auth
- `POST /api/v1/auth/login` -> Returns JWT token & User Role.

### HR
- `GET /api/v1/hr/employees` -> List of employees.
- `GET /api/v1/hr/attendance?date={date}` -> Daily logs.
- `PATCH /api/v1/hr/attendance/lock` -> Logic: prevents edits to logs for {date}.

### Finance
- `GET /api/v1/finance/transactions` -> List of income/expenses.
- `GET /api/v1/finance/summary` -> Aggregates: Cash Available, Receivables.

### Audit
- `POST /api/v1/admin/audit` -> Logger middleware to capture user actions.

## Integration Config
The frontend is configured to point to `/api` by default. Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your FastAPI server (e.g., `http://localhost:8000`).
