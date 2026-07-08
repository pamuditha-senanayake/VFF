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
  ChevronRight,
  ChevronDown,
  UserCheck,
  Globe,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const sections = [
  {
    title: 'MENU',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Director'] },
      { label: 'HR Module', href: '/hr', icon: Users, roles: ['Admin'] },
      { label: 'Finance', href: '/finance', icon: Wallet, roles: ['Admin', 'Director'] },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Programs', href: '/programs', icon: Handshake, roles: ['Admin', 'Director'] },
      { label: 'Inventory', href: '/inventory', icon: Package, roles: ['Admin', 'Director'] },
      { 
        label: 'Admin Panel', 
        href: '/admin', 
        icon: ShieldCheck, 
        roles: ['Admin'],
        subItems: [
          { label: 'User Registry', href: '/admin', icon: UserCheck }
        ]
      },
    ]
  },
  {
    title: 'PERSONAL',
    items: [
      { label: 'Go to Website Home', href: '/', icon: Globe, roles: ['Admin', 'Director', 'Finance Officer', 'HR Officer', 'Operations Lead', 'General Staff', 'System Administrator'] },
      { label: 'Edit Profile', href: '/profile', icon: User, roles: ['Admin', 'Director', 'Finance Officer', 'HR Officer', 'Operations Lead', 'General Staff', 'System Administrator'] },
      { label: 'Account Settings', href: '/settings', icon: Settings, roles: ['Admin', 'Director', 'Finance Officer', 'HR Officer', 'Operations Lead', 'General Staff', 'System Administrator'] },
      { label: 'Support', href: '/support', icon: HelpCircle, roles: ['Admin', 'Director', 'Finance Officer', 'HR Officer', 'Operations Lead', 'General Staff', 'System Administrator'] },
    ]
  }
];

export function Sidebar({ isCollapsed, onToggle, isMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isAdminExpanded, setIsAdminExpanded] = useState(true);

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
            <span className="text-xl font-bold font-heading bg-gradient-to-r from-amber-400 to-[#EF9F27] bg-clip-text text-transparent hover:opacity-90">
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
        {sections.map((section) => {
          const filteredItems = section.items.filter(item => 
            user && item.roles.includes(user.role)
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
                  const isActive = pathname.startsWith(item.href);
                  const hasSubs = 'subItems' in item && item.subItems;

                  if (hasSubs && !isCollapsed) {
                    return (
                      <div key={item.href} className="space-y-1">
                        <div 
                          onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                          className={cn(
                            "flex items-center justify-between py-2.5 rounded-lg cursor-pointer transition-colors pl-3 pr-2 text-text-secondary hover:bg-bg-subtle hover:text-text-primary",
                            isActive && "bg-amber-500/5 text-[#EF9F27]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={20} className={isActive ? "text-[#EF9F27]" : "text-text-secondary"} />
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          <ChevronDown size={16} className={cn("transition-transform", isAdminExpanded && "rotate-180")} />
                        </div>
                        
                        {isAdminExpanded && item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link key={sub.href} href={sub.href}>
                              <div className={cn(
                                "flex items-center gap-3 py-2 rounded-lg cursor-pointer transition-colors pl-8 pr-2 mt-0.5",
                                isSubActive 
                                  ? "bg-amber-500/10 text-[#EF9F27] border-l-2 border-[#EF9F27] rounded-l-none pl-7" 
                                  : "hover:bg-bg-subtle text-text-secondary hover:text-text-primary"
                              )}>
                                <SubIcon size={16} />
                                <span className="text-xs font-semibold">{sub.label}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  }

                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 py-2.5 rounded-lg transition-colors group cursor-pointer",
                        isActive 
                          ? "bg-amber-500/10 text-[#EF9F27] border-l-4 border-[#EF9F27] rounded-l-none pl-2" 
                          : "hover:bg-bg-subtle text-text-secondary hover:text-text-primary pl-3"
                      )}>
                        <Icon size={20} className={cn(
                          "shrink-0",
                          isActive ? "text-[#EF9F27]" : "text-text-secondary group-hover:text-text-primary"
                        )} />
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
