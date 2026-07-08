'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Moon, 
  Sun, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Info,
  CheckCircle2,
  Wallet,
  Users,
  Package,
  Handshake,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface IMSNotification {
  id: number;
  module: 'finance' | 'hr' | 'inventory' | 'programs';
  message: string;
  time: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: IMSNotification[] = [
  { id: 1, module: 'finance', message: 'Regional vaccination funding allotment approved.', time: '10 mins ago', isRead: false },
  { id: 2, module: 'hr', message: 'Attendance records for June locked by admin.', time: '1 hour ago', isRead: false },
  { id: 3, module: 'inventory', message: 'Low stock alert: Rabies vaccine vials below 50 units.', time: '3 hours ago', isRead: false },
  { id: 4, module: 'programs', message: 'Milestone reach: 1,000 sterilizations in Galle Clinic.', time: '5 hours ago', isRead: false },
  { id: 5, module: 'finance', message: 'Annual audit report compiled and ready for review.', time: '1 day ago', isRead: true },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  
  // Module notification toggles
  const [moduleToggles, setModuleToggles] = useState({
    finance: true,
    hr: true,
    inventory: true,
    programs: true,
  });

  // Notifications feed state
  const [notifications, setNotifications] = useState<IMSNotification[]>(INITIAL_NOTIFICATIONS);

  // Apply actual theme class to DOM when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (themeMode === 'light') {
      root.classList.add('light-theme');
      root.style.setProperty('--background', '#F9FAFB');
      root.style.setProperty('--foreground', '#111827');
      toast.info('Light theme preference loaded');
    } else {
      root.classList.remove('light-theme');
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      toast.info('Dark theme preference loaded');
    }
  }, [themeMode]);

  // Handle module toggle switches
  const handleToggle = (module: 'finance' | 'hr' | 'inventory' | 'programs') => {
    const newToggles = { ...moduleToggles, [module]: !moduleToggles[module] };
    setModuleToggles(newToggles);
    toast.success(`Notifications for ${module.toUpperCase()} ${newToggles[module] ? 'Enabled' : 'Disabled'}`);
  };

  // Filter notifications based on toggles
  const visibleNotifications = notifications.filter(n => moduleToggles[n.module]);

  // Actions
  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    toast.success('Notification marked as read');
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notifications removed');
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'finance': return <Wallet className="h-4 w-4 text-accent" />;
      case 'hr': return <Users className="h-4 w-4 text-accent" />;
      case 'inventory': return <Package className="h-4 w-4 text-accent" />;
      case 'programs': return <Handshake className="h-4 w-4 text-accent" />;
      default: return <Info className="h-4 w-4 text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
          Settings & Configurations
        </h1>
        <p className="text-text-secondary text-sm">
          Configure preference modules, notification feeds, and layout visual themes.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-bg-subtle border border-border-brand p-1 rounded-lg">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-surface data-[state=active]:text-accent text-xs font-semibold rounded-md transition-all">
            Notifications Feed
          </TabsTrigger>
          <TabsTrigger value="app" className="data-[state=active]:bg-surface data-[state=active]:text-accent text-xs font-semibold rounded-md transition-all">
            Preferences & Theme
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Toggles Panel */}
            <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-sm font-semibold text-text-primary">Module Toggles</CardTitle>
                <CardDescription className="text-text-secondary text-[11px] mt-1">Receive notifications for selected system modules.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-4 space-y-5">
                {[
                  { key: 'finance', label: 'Finance Module', desc: 'Invoices, ledger updates, payroll calculations.' },
                  { key: 'hr', label: 'HR & Personnel', desc: 'Shift clockings, attendance locks, staff logs.' },
                  { key: 'inventory', label: 'Inventory Supplies', desc: 'Low stock alerts, order arrivals, item issues.' },
                  { key: 'programs', label: 'Tactical Programs', desc: 'Campaign status updates, milestones.' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                      <p className="text-[10px] text-text-secondary leading-snug">{item.desc}</p>
                    </div>
                    <Switch 
                      checked={moduleToggles[item.key as keyof typeof moduleToggles]} 
                      onCheckedChange={() => handleToggle(item.key as any)}
                      className="data-[state=checked]:bg-[#EF9F27]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* List Feed Panel */}
            <Card className="md:col-span-2 bg-surface border border-border-brand rounded-card shadow-card p-5 flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                  <div>
                    <CardTitle className="text-base font-semibold font-heading text-text-primary">Live Activity Feed</CardTitle>
                    <CardDescription className="text-text-secondary text-xs mt-1">Filtered by active module toggles.</CardDescription>
                  </div>
                  {visibleNotifications.length > 0 && (
                    <div className="flex gap-2">
                      <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="border-border-brand text-text-primary hover:bg-bg-subtle text-[10px] px-2.5 h-8">
                        <Check className="mr-1.5 h-3.5 w-3.5" /> Read All
                      </Button>
                      <Button onClick={handleClearAll} variant="outline" size="sm" className="border-red-500/20 text-negative hover:bg-red-500/10 text-[10px] px-2.5 h-8">
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear All
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-0 pt-4 space-y-3">
                  {visibleNotifications.length === 0 ? (
                    <div className="text-center py-12 text-text-muted text-xs italic">
                      No notifications to display in this feed.
                    </div>
                  ) : (
                    visibleNotifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                          n.isRead 
                            ? 'bg-[#14161C]/20 border-border-brand' 
                            : 'bg-accent/5 border-accent/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded bg-bg-subtle border border-border-brand mt-0.5">
                            {getModuleIcon(n.module)}
                          </div>
                          <div>
                            <p className={`text-xs ${n.isRead ? 'text-text-secondary' : 'text-text-primary font-semibold'}`}>
                              {n.message}
                            </p>
                            <span className="text-[10px] text-text-muted mt-1 block font-mono">{n.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {!n.isRead && (
                            <Button 
                              onClick={() => handleMarkAsRead(n.id)}
                              variant="ghost" 
                              size="sm"
                              className="text-accent hover:bg-accent/10 h-7 w-7 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleDelete(n.id)}
                            variant="ghost" 
                            size="sm"
                            className="text-text-secondary hover:text-negative hover:bg-red-500/10 h-7 w-7 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="app" className="mt-6">
          <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-semibold font-heading text-text-primary">Theme Settings</CardTitle>
              <CardDescription className="text-text-secondary text-xs mt-1">Configure workspace aesthetic parameters and interface styling.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-bg-subtle border border-border-brand">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-text-primary">Visual Layout Theme</h4>
                  <p className="text-xs text-text-secondary">Toggle between high-contrast dark theme and light theme options.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className={`h-4 w-4 ${themeMode === 'light' ? 'text-accent' : 'text-text-secondary'}`} />
                  <Switch 
                    checked={themeMode === 'dark'} 
                    onCheckedChange={(checked) => setThemeMode(checked ? 'dark' : 'light')}
                    className="data-[state=checked]:bg-[#EF9F27]"
                  />
                  <Moon className={`h-4 w-4 ${themeMode === 'dark' ? 'text-accent' : 'text-text-secondary'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-bg-subtle border border-border-brand">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-text-primary">Tabular Data Font scaling</h4>
                  <p className="text-xs text-text-secondary">Enforce JetBrains Mono sizing rules for numerical records.</p>
                </div>
                <Switch 
                  defaultChecked={true}
                  className="data-[state=checked]:bg-[#EF9F27]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
