import ProtectedRoute from "@/components/layout/protected-route";

export default function ProgramDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requiredPermission="programs:read">
      <div className="p-6">
        <h1 className="text-2xl font-bold font-heading text-text-primary">Program Details: {params.id}</h1>
        <p className="text-text-secondary mt-2">Placeholder for program details.</p>
      </div>
    </ProtectedRoute>
  );
}
