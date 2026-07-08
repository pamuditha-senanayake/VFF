'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Bell, Search, User, Menu, Settings, HelpCircle, LogOut } from 'lucide-react';
import { CommandPalette } from '@/components/shared/command-palette';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  onMenuToggle?: () => void;
  title?: string;
}

export function Topbar({ onMenuToggle, title = "Overview" }: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut for ⌘K or Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowPalette((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: "New transaction approved by Director", time: "5 mins ago" },
    { id: 2, text: "Annual medical inventory audit scheduled", time: "1 hour ago" },
    { id: 3, text: "System database backup complete", time: "4 hours ago" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 border-b border-[#232730] bg-[#0B0D12]/80 backdrop-blur-md">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="p-1.5 text-[#9CA3AF] hover:text-[#F9FAFB] lg:hidden rounded-lg hover:bg-[#14161C]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="hidden md:block text-lg font-semibold font-heading text-[#F9FAFB]">
            {title}
          </h2>
        </div>

        {/* Center/Right-Center: Global Search */}
        <div className="flex-1 max-w-md mx-6">
          <button 
            onClick={() => setShowPalette(true)}
            className="flex items-center w-full gap-2 px-3 py-1.5 text-left text-sm text-[#6B7280] bg-[#14161C] border border-[#232730] rounded-lg hover:bg-[#1C202B] hover:text-[#9CA3AF] transition-colors"
          >
            <Search className="w-4 h-4 shrink-0 text-[#6B7280]" />
            <span>Search dashboard...</span>
            <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono text-[#6B7280] bg-[#1F232D] border border-[#2D3342] rounded-md">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Notifications & Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-[#9CA3AF] hover:text-[#F9FAFB] rounded-lg hover:bg-[#14161C] transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF9F27]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#14161C] border border-[#232730] rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-[#232730]">
                  <span className="text-xs font-semibold text-[#F9FAFB]">Notifications</span>
                </div>
                <div className="divide-y divide-[#232730]">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-[#1C202B] cursor-pointer">
                      <p className="text-xs text-[#9CA3AF]">{n.text}</p>
                      <span className="text-[10px] text-[#6B7280] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[#232730] text-center">
                  <a href="#" className="text-[11px] text-[#EF9F27] hover:underline font-medium">
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1 text-[#9CA3AF] hover:text-[#F9FAFB] rounded-full hover:bg-[#14161C] transition-all"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-[#EF9F27]/20 text-[#EF9F27] text-sm font-semibold">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-[#14161C] border border-[#232730] rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-100">
                <div className="px-4 py-3 border-b border-[#232730]">
                  <p className="text-xs font-semibold text-[#F9FAFB] truncate">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => { router.push('/profile'); setShowProfile(false); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs text-[#9CA3AF] hover:bg-[#1C202B] hover:text-[#F9FAFB] rounded-lg transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Edit profile</span>
                  </button>
                  <button 
                    onClick={() => { router.push('/settings'); setShowProfile(false); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs text-[#9CA3AF] hover:bg-[#1C202B] hover:text-[#F9FAFB] rounded-lg transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Account settings</span>
                  </button>
                  <button 
                    onClick={() => { router.push('/support'); setShowProfile(false); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs text-[#9CA3AF] hover:bg-[#1C202B] hover:text-[#F9FAFB] rounded-lg transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Support</span>
                  </button>
                </div>
                <div className="p-1 border-t border-[#232730]">
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs text-[#DC2626] hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette open={showPalette} onClose={() => setShowPalette(false)} />
    </>
  );
}
