'use client';

import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/layout/protected-route";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-950">
        <Skeleton className="w-64 h-full bg-slate-900" />
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-48 mb-8 bg-slate-900" />
          <Skeleton className="h-64 w-full bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300 min-h-screen">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
