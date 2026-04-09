import os
from datetime import date, datetime, timedelta
from app.core.supabase import get_supabase

def seed_data():
    supabase = get_supabase()
    print("🌱 Starting database seeding...")

    # 1. Programs
    print("Inserting programs...")
    programs = [
        {"program_name": "Rabies Vaccination Drive", "total_animals_treated": 150, "status": "Active"},
        {"program_name": "Street Dog Sterilization", "total_animals_treated": 45, "status": "In Progress"},
        {"program_name": "Emergency Animal Rescue", "total_animals_treated": 12, "status": "Active"}
    ]
    supabase.table("programs").insert(programs).execute()

    # 2. Get Program IDs
    programs_db = supabase.table("programs").select("id").execute().data
    p_ids = [p['id'] for p in programs_db]

    # 3. Inventory Items
    print("Inserting inventory items...")
    items = [
        {"item_name": "Rabies Vaccine", "current_stock": 500, "unit_cost": 450.00},
        {"item_name": "Surgical Kits", "current_stock": 25, "unit_cost": 2500.00},
        {"item_name": "Dog Food (20kg)", "current_stock": 100, "unit_cost": 1200.00},
        {"item_name": "Bandages", "current_stock": 200, "unit_cost": 50.00}
    ]
    supabase.table("inventory_items").insert(items).execute()
    
    items_db = supabase.table("inventory_items").select("id").execute().data
    i_ids = [i['id'] for i in items_db]

    # 4. Inventory Transactions
    print("Inserting inventory transactions...")
    inv_transactions = [
        {"item_id": i_ids[0], "program_id": p_ids[0], "quantity": 50, "transaction_type": "Issue"},
        {"item_id": i_ids[1], "program_id": p_ids[1], "quantity": 5, "transaction_type": "Issue"},
        {"item_id": i_ids[2], "program_id": p_ids[2], "quantity": 10, "transaction_type": "Issue"}
    ]
    supabase.table("inventory_transactions").insert(inv_transactions).execute()

    # 5. Financial Transactions
    print("Inserting financial transactions...")
    fin_transactions = [
        {"amount": 50000.00, "transaction_type": "Income", "status": "Cash", "program_id": p_ids[0], "transaction_date": str(date.today())},
        {"amount": 15000.00, "transaction_type": "Expense", "status": "Cash", "program_id": p_ids[1], "transaction_date": str(date.today() - timedelta(days=1))},
        {"amount": 25000.00, "transaction_type": "Income", "status": "Receivable", "program_id": p_ids[2], "transaction_date": str(date.today() - timedelta(days=2))},
        {"amount": 8000.00, "transaction_type": "Expense", "status": "Cash", "program_id": p_ids[0], "transaction_date": str(date.today() - timedelta(days=3))}
    ]
    supabase.table("financial_transactions").insert(fin_transactions).execute()

    # 6. Employees (No user_id for now)
    print("Inserting employees...")
    employees = [
        {"first_name": "Sunil", "last_name": "Perera", "nic": "851234567V", "base_salary": 75000.00, "status": "Active"},
        {"first_name": "Kamala", "last_name": "Silva", "nic": "925678123V", "base_salary": 65000.00, "status": "Active"},
        {"first_name": "Ruwan", "last_name": "Kumara", "nic": "781122334V", "base_salary": 90000.00, "status": "Active"}
    ]
    supabase.table("employee_profile").insert(employees).execute()
    
    emp_db = supabase.table("employee_profile").select("id").execute().data
    e_ids = [e['id'] for e in emp_db]

    # 7. Attendance
    print("Inserting attendance logs...")
    attendance = [
        {"employee_id": e_ids[0], "target_date": str(date.today()), "clock_in": datetime.now().isoformat(), "worked_hours": 8.0},
        {"employee_id": e_ids[1], "target_date": str(date.today()), "clock_in": datetime.now().isoformat(), "worked_hours": 7.5},
        {"employee_id": e_ids[2], "target_date": str(date.today()), "clock_in": datetime.now().isoformat(), "worked_hours": 9.0}
    ]
    supabase.table("attendance_log").insert(attendance).execute()

    print("✅ Seeding complete!")

if __name__ == "__main__":
    seed_data()
