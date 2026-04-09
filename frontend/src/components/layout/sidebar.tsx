'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Handshake, 
  Package, 
  ShieldCheck, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Director'] },
  { label: 'HR Module', href: '/hr', icon: Users, roles: ['Admin'] },
  { label: 'Finance', href: '/finance', icon: Wallet, roles: ['Admin', 'Director'] },
  { label: 'Programs', href: '/programs', icon: Handshake, roles: ['Admin', 'Director'] },
  { label: 'Inventory', href: '/inventory', icon: Package, roles: ['Admin', 'Director'] },
  { label: 'Admin', href: '/admin', icon: ShieldCheck, roles: ['Admin'] },
];


export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-slate-950 text-slate-200 transition-all duration-300 z-50 flex flex-col border-r border-slate-800",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        {!isCollapsed && <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">VFF IMS</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-white"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                  : "hover:bg-slate-900 text-slate-400 hover:text-slate-100"
              )}>
                <Icon size={22} className={cn(
                  "shrink-0",
                  isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-100"
                )} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed && user && (
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        )}
        <Button 
          variant="ghost" 
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all",
            isCollapsed && "px-0 justify-center"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
