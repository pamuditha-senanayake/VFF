'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, Users, Wallet, Handshake, Package, ShieldCheck } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const items = [
  { label: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Financial Management', href: '/finance', icon: Wallet },
  { label: 'HR Module / Employees', href: '/hr', icon: Users },
  { label: 'Programs & Allocations', href: '/programs', icon: Handshake },
  { label: 'Inventory & Assets', href: '/inventory', icon: Package },
  { label: 'System Admin Panel', href: '/admin', icon: ShieldCheck },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setActiveIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Filter items
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Key navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          router.push(filtered[activeIndex].href);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, filtered, activeIndex, router, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-xs">
      <div 
        ref={modalRef}
        className="w-full max-w-[550px] bg-surface border border-border-brand rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Input */}
        <div className="flex items-center px-4 py-3 border-b border-border-brand gap-3">
          <Search className="w-5 h-5 text-text-secondary" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            className="flex-1 bg-transparent border-0 text-sm text-text-primary placeholder:text-text-secondary/60 focus:ring-0 focus:outline-hidden"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-text-secondary bg-bg-brand border border-border-brand rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-text-secondary">
              No results found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-amber-500/10 text-[#EF9F27]' 
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
