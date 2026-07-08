'use client';

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import ProtectedRoute from "@/components/layout/protected-route";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/dashboard')) return "System Overview";
  if (pathname.startsWith('/finance')) return "Financial Management";
  if (pathname.startsWith('/hr')) return "Human Resources";
  if (pathname.startsWith('/programs')) return "Programs & Projects";
  if (pathname.startsWith('/inventory')) return "Inventory Management";
  if (pathname.startsWith('/admin')) return "System Admin";
  if (pathname.startsWith('/profile')) return "My Profile";
  if (pathname.startsWith('/settings')) return "Account Settings";
  if (pathname.startsWith('/support')) return "Support Center";
  return "Overview";
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-bg-subtle">
        <Skeleton className="w-64 h-full bg-surface border-r border-border-brand" />
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-48 mb-8 bg-surface" />
          <Skeleton className="h-64 w-full bg-surface" />
        </div>
      </div>
    );
  }

  const title = getPageTitle(pathname);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-bg-subtle text-text-primary">
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <div className={cn(
          "flex-1 transition-all duration-300 min-h-screen flex flex-col",
          isCollapsed ? "ml-20" : "ml-20 lg:ml-64"
        )}>
          <Topbar title={title} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
