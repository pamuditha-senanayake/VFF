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

function Breadcrumbs({ pathname }: { pathname: string }) {
  const paths = pathname.split('/').filter(Boolean);
  
  if (paths.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
      {paths.map((p, idx) => {
        const isLast = idx === paths.length - 1;
        const capitalized = p.charAt(0).toUpperCase() + p.slice(1);
        return (
          <div key={p} className="flex items-center gap-2">
            <span className={isLast ? "text-text-primary font-semibold" : ""}>
              {capitalized}
            </span>
            {!isLast && <span>/</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

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
      <div className="flex min-h-screen bg-bg-subtle text-text-primary overflow-x-hidden">
        {/* Mobile sidebar overlay backdrop */}
        {isMobileOpen && (
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-[#0B0D12]/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          />
        )}

        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggle={() => setIsCollapsed(!isCollapsed)} 
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
        
        <div className={cn(
          "flex-1 transition-all duration-300 min-h-screen flex flex-col ml-0 lg:ml-64",
          isCollapsed && "lg:ml-20"
        )}>
          <Topbar title={title} onMenuToggle={() => setIsMobileOpen(!isMobileOpen)} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
              <Breadcrumbs pathname={pathname} />
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
