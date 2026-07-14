'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { hasPermission } from '@/lib/permissions';
import { NAVIGATION_CONFIG } from '@/lib/navigation';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, isMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-bg-brand text-text-primary transition-all duration-300 z-50 flex flex-col border-r border-border-brand w-64 lg:translate-x-0",
      isCollapsed ? "lg:w-20" : "lg:w-64",
      isMobileOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border-brand">
        {!isCollapsed ? (
          <Link href="/" className="cursor-pointer">
            <span className="text-xl font-bold font-heading dark:bg-gradient-to-r dark:from-amber-400 dark:to-[#EF9F27] dark:bg-clip-text dark:text-transparent light:text-[#0B0D12] text-text-primary hover:opacity-90">
              VFF IMS
            </span>
          </Link>
        ) : (
          <Link href="/" className="cursor-pointer block mx-auto">
            <span className="text-sm font-extrabold text-accent">V</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="text-text-secondary hover:text-text-primary hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        {NAVIGATION_CONFIG.map((section) => {
          const filteredItems = section.items.filter(item => 
            user && (!item.requiredPermission || hasPermission(user.role, item.requiredPermission))
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-2">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold tracking-wider text-text-secondary">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === '/dashboard' : true);

                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 py-2.5 rounded-lg transition-colors group cursor-pointer",
                        isActive 
                          ? "dark:bg-amber-500/10 dark:text-[#EF9F27] dark:border-[#EF9F27] light:bg-[#0B0D12] light:text-white light:border-[#0B0D12] border-l-4 rounded-l-none pl-2" 
                          : "hover:bg-bg-subtle text-text-secondary hover:text-text-primary pl-3"
                      )}>
                        {Icon && <Icon size={20} className={cn(
                          "shrink-0",
                          isActive ? "dark:text-[#EF9F27] light:text-white" : "text-text-secondary group-hover:text-text-primary"
                        )} />}
                        {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border-brand">
        {!isCollapsed && user && (
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold truncate text-text-primary">{user.name}</p>
            <p className="text-xs text-text-secondary capitalize mt-0.5">{user.role}</p>
          </div>
        )}
        <Button 
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-3 justify-start text-text-secondary hover:text-[#DC2626] hover:bg-rose-500/10 transition-all",
            isCollapsed && "px-0 justify-center"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
