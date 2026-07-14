import ProtectedRoute from "@/components/layout/protected-route";

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredPermission="finance:read">
      <div className="p-6">
        <h1 className="text-2xl font-bold font-heading text-text-primary">Financial Reports</h1>
        <p className="text-text-secondary mt-2">Placeholder for financial reports.</p>
      </div>
    </ProtectedRoute>
  );
}
