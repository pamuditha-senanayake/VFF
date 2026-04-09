-- Supabase Database Initialization Script for VFF IMS

-- 1. ROLES Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (role_name) VALUES ('Admin'), ('Director') ON CONFLICT DO NOTHING;

-- 2. USERS Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Not used for Supabase Auth, but kept for ER diagram compliance
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EMPLOYEE_PROFILE Table
CREATE TABLE IF NOT EXISTS employee_profile (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nic VARCHAR(20) UNIQUE NOT NULL,
    base_salary DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- 4. ATTENDANCE_LOG Table
CREATE TABLE IF NOT EXISTS attendance_log (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employee_profile(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    clock_in TIMESTAMP WITH TIME ZONE,
    clock_out TIMESTAMP WITH TIME ZONE,
    worked_hours DECIMAL(5, 2),
    is_locked BOOLEAN DEFAULT FALSE
);

-- 5. PAYROLL_LEDGER Table
CREATE TABLE IF NOT EXISTS payroll_ledger (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employee_profile(id) ON DELETE CASCADE,
    payroll_month INTEGER NOT NULL,
    payroll_year INTEGER NOT NULL,
    net_payable DECIMAL(12, 2) NOT NULL
);

-- 6. PROGRAM Table
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    total_animals_treated INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 7. FINANCIAL_TRANSACTION Table
CREATE TABLE IF NOT EXISTS financial_transactions (
    id SERIAL PRIMARY KEY,
    transaction_date DATE DEFAULT CURRENT_DATE,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Income', 'Expense')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('Cash', 'Receivable')),
    program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL
);

-- 8. INVENTORY_ITEM Table
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    current_stock INTEGER DEFAULT 0,
    unit_cost DECIMAL(12, 2) NOT NULL
);

-- 9. INVENTORY_TRANSACTION Table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES inventory_items(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('Issue', 'Return')),
    transaction_date DATE DEFAULT CURRENT_DATE
);

-- 10. SYSTEM_AUDIT_LOG Table
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    old_payload JSONB,
    new_payload JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional, can be managed via Supabase UI)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
