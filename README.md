# VFF Integrated Management System (IMS)

A centralized platform integrating HR, Finance, Program Management, and Inventory with strict RBAC and audit logging. Designed for efficiency, transparency, and real-time operational visibility.

## 🚀 Overview

VFF IMS is a production-ready management platform built with modern technologies to handle enterprise-scale operations. It bridges the gap between financial tracking and operational data, providing a unified source of truth for the entire organization.

## ✨ Key Features

- **Real-time Financial Visibility**: Track cash vs receivables with dynamic LKR-aligned visualizations.
*   **Role-Based Access Control**: Secure login and module-level permissions (Admin/Director/Staff).
- **Automated HR & Payroll**: Attendance logs with finalizing mechanisms.
- **Program Impact Tracking**: Manage environment initiatives (e.g., sterilization, vaccination) with live metrics.
- **Inventory Tracking**: Manage stock levels and transactions linked directly to operational programs.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand (Persisted)
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS & ShadCN UI
- **Visuals**: Recharts for high-fidelity data visualization

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT via Supabase GoTrue

## 📦 Getting Started

### 1. Clone & Core Setup
```bash
git clone https://github.com/shamilaw-sci/CSC3213_20_Group_C
cd CSC3213_20_Group_C
```

### 2. Backend Setup
Navigate to the backend directory and set up your environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
**Environment Variables**: Create a `.env` file in the `backend/` folder:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
PORT=8000
```
**Run Backend**:
```bash
export PYTHONPATH=$PYTHONPATH:.
python3 app/main.py
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
npm install
```
**Environment Variables**: Create a `.env.local` file in the `frontend/` folder:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
**Run Frontend**:
```bash
npm run dev
```

## 👥 Role Access Reference & Sitemap
- **Admin**: Full access across all modules (System Admin).
- **Director**: Access to Operational/Financial dashboards (Finance, Programs, Inventory, Audit Logs).
- **HR Officer**: Access to Employees, Attendance, and Payroll.
- **Finance Officer**: Access to Finance modules (Ledger, Payables, Receivables) and Inventory.
- **Staff**: Limited access (Self-service Attendance, active programs).

## 🔑 Demo Credentials
The database comes pre-seeded with the following demo users (Password: `Password123!` for all):
- `admin@vff.test` (Admin)
- `director@vff.test` (Director)
- `hr@vff.test` (HR Officer)
- `finance@vff.test` (Finance Officer)
- `staff@vff.test` (Staff)

## 📄 License
Internal use only by VFF. Proprietary and Confidential.
