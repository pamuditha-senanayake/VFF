'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await AuthService.login({ email, password });
      
      // Verify the user logging in has Admin role
      if (data.user.role !== 'Admin' && data.user.role !== 'System Administrator') {
        toast.error('Access denied. Administrator privileges required.');
        setLoading(false);
        return;
      }

      setAuth(data.user, data.access_token);
      toast.success('Admin access granted. Welcome back.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-bg-brand text-text-primary font-sans selection:bg-[#EF9F27]/30 overflow-hidden">
      
      {/* Left Pane - Inset Space Visuals Container */}
      <div className="hidden md:flex p-6 h-full w-full">
        <div 
          className="relative flex-1 flex flex-col justify-between p-10 bg-cover bg-center rounded-2xl overflow-hidden border border-border-brand shadow-2xl"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1600&q=80')" 
          }}
          id="visual-pane"
        >
          <div className="absolute inset-0 bg-gradient-to-b dark:from-[#0B0D12]/60 dark:to-[#0B0D12]/95 light:from-white/40 light:to-white/90 via-transparent pointer-events-none" />
          
          {/* Top Row: Logo & Back Button */}
          <div className="relative flex justify-between items-center z-10">
            <span className="text-lg font-extrabold tracking-wider text-text-primary dark:text-white font-heading">
              VFF IMS
            </span>
            <Link 
              href="/"
              className="text-[11px] font-bold text-text-secondary hover:text-text-primary bg-bg-subtle/85 py-2 px-4 rounded-lg flex items-center gap-1 border border-border-brand backdrop-blur-md hover:bg-bg-brand transition-all duration-150"
            >
              Back to website →
            </Link>
          </div>

          {/* Bottom Row: Main Caption & Slide Indicators */}
          <div className="relative z-10 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-text-primary dark:text-white font-heading">
              System administration, <br />
              securing access.
            </h1>
            
            {/* Indicators */}
            <div className="flex gap-2 items-center">
              <span className="h-0.5 w-8 bg-[#EF9F27] rounded-full transition-all duration-200" />
              <span className="h-0.5 w-8 bg-white/20 rounded-full transition-all duration-200" />
              <span className="h-0.5 w-8 bg-white/20 rounded-full transition-all duration-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form directly on Background */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-20 relative bg-bg-brand">
        <div className="w-full max-w-md flex flex-col gap-8">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#EF9F27] mb-1">
              <ShieldAlert size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Secure Node Access</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary font-heading">
              Admin portal access
            </h2>
            <p className="text-xs text-text-secondary">
              Authorized IT administrator personnel only.{' '}
              <Link href="/login" className="text-[#EF9F27] hover:underline font-semibold">
                User Login
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-[14px] text-text-secondary/40" size={16} />
              <Input 
                id="email" 
                type="email" 
                placeholder="Admin Email Address" 
                className="pl-11 bg-bg-subtle border-border-brand text-text-primary focus:border-[#EF9F27] focus:ring-1 focus:ring-[#EF9F27] h-11 rounded-lg w-full placeholder:text-text-secondary/40 text-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-[14px] text-text-secondary/40" size={16} />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                className="pl-11 pr-10 bg-bg-subtle border-border-brand text-text-primary focus:border-[#EF9F27] focus:ring-1 focus:ring-[#EF9F27] h-11 rounded-lg w-full placeholder:text-text-secondary/40 text-xs"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-[14px] text-text-secondary/40 hover:text-text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Primary Action Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#EF9F27] hover:bg-[#EF9F27]/80 text-[#0B0D12] font-semibold text-xs py-3 px-6 mt-2 transition-all rounded-lg active:scale-95 h-11 flex items-center justify-center gap-2 border-none shadow-md shadow-[#EF9F27]/10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0D12] border-t-transparent" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Authorize Admin Access
                </>
              )}
            </Button>
          </form>
          
          {/* Footer Terms Note */}
          <p className="text-[10px] text-text-secondary/45 text-center">
            Internal use only by VFF. Proprietary and Confidential.
          </p>

        </div>
      </div>
    </div>
  );
}
