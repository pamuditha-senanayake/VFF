# VFF Integrated Management System (IMS)

A centralized platform integrating HR, Finance, Program Management, and Inventory with strict RBAC and audit logging. Designed for efficiency, transparency, and real-time operational visibility.

## 🚀 Overview

VFF IMS is a production-ready management platform built with modern technologies to handle enterprise-scale operations. It bridges the gap between financial tracking and operational data, providing a unified source of truth for the entire organization.

## ✨ Key Features

- **Real-time Financial Visibility**: Track cash vs receivables with intuitive visualizations.
- **Automated HR & Payroll**: Attendance logs with finalizing/locking mechanics for automated payroll preparation.
- **Program Cost Analysis**: In-depth analysis of costs per program (e.g., cost per animal treated).
- **Inventory Tracking**: Manage stock levels and transactions linked directly to operational programs.
- **Strict RBAC & Audit Logs**: Role-based access control (Director/Admin) with full activity auditing.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand (Persisted)
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS & ShadCN UI
- **Visuals**: Recharts for high-fidelity data visualization

### Backend (Proposed)
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Security**: JWT & OAuth2

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shamilaw-sci/CSC3213_20_Group_C
   cd CSC3213_20_Group_C
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

### Running the Project

#### Frontend
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

#### Backend
For backend setup instructions, please refer to the [BACKEND_SETUP.md](BACKEND_SETUP.md) file in the root directory.

## 👥 Role Access
- **Admin**: Full access to all modules, including Audit Logs and User Management.
- **Director**: Access to Operational and Financial dashboards (HR, Finance, Programs, Inventory).

## 📄 License
This project is proprietary and confidential. Internal use only by VFF.
