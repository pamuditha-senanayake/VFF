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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#13111c] text-white font-sans selection:bg-[#6366f1]/30 overflow-hidden">
      
      {/* Left Pane - Inset Space Visuals Container */}
      <div className="hidden md:flex p-[24px] h-full w-full">
        <div 
          className="relative flex-1 flex flex-col justify-between p-[40px] bg-cover bg-center rounded-2xl overflow-hidden border border-[#252236]/30 shadow-2xl"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1600&q=80')" 
          }}
          id="visual-pane"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#13111c]/60 via-transparent to-[#13111c]/95 pointer-events-none" />
          
          {/* Top Row: Logo & Back Button */}
          <div className="relative flex justify-between items-center z-10">
            <span className="text-[20px] font-extrabold tracking-tight text-white font-sans flex items-center gap-1">
              VFF
            </span>
            <Link 
              href="/"
              className="text-[12px] font-semibold text-white/70 bg-white/5 py-2 px-4 rounded-full flex items-center gap-1 border border-white/10 backdrop-blur-md hover:text-white hover:bg-white/10 transition-all duration-150"
            >
              Back to website →
            </Link>
          </div>

          {/* Bottom Row: Main Caption & Slide Indicators */}
          <div className="relative z-10 space-y-[32px]">
            <h1 className="text-[32px] lg:text-[40px] font-bold leading-[1.2] tracking-tight text-white font-sans">
              System administration, <br />
              securing access.
            </h1>
            
            {/* Indicators */}
            <div className="flex gap-[8px] items-center">
              <span className="h-[2px] w-[32px] bg-white rounded-full transition-all duration-200" />
              <span className="h-[2px] w-[32px] bg-white/30 rounded-full transition-all duration-200" />
              <span className="h-[2px] w-[32px] bg-white/30 rounded-full transition-all duration-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form directly on Background */}
      <div className="flex items-center justify-center p-[24px] md:p-[48px] lg:p-[80px] relative">
        <div className="w-full max-w-md flex flex-col gap-[32px]">
          
          {/* Header */}
          <div className="space-y-[8px]">
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <ShieldAlert size={20} />
              <span className="text-[12px] font-bold uppercase tracking-widest font-mono">Secure Node Access</span>
            </div>
            <h2 className="text-[32px] font-bold tracking-tight text-white font-sans">
              Admin portal access
            </h2>
            <p className="text-[14px] text-[#8b9ab0] font-sans">
              Authorized IT administrator personnel only.{' '}
              <Link href="/login" className="text-[#6366f1] hover:underline font-semibold">
                User Login
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-[16px]">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-[16px] top-[14px] text-[#8b9ab0]/50" size={18} />
              <Input 
                id="email" 
                type="email" 
                placeholder="Admin Email Address" 
                className="pl-11 bg-[#1c1a27] border-[#252236] text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] h-12 rounded-lg font-sans w-full placeholder:text-[#8b9ab0]/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-[16px] top-[14px] text-[#8b9ab0]/50" size={18} />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                className="pl-11 pr-10 bg-[#1c1a27] border-[#252236] text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] h-12 rounded-lg font-sans w-full placeholder:text-[#8b9ab0]/40"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-[16px] top-[14px] text-[#8b9ab0]/50 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Primary Action Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-[15px] py-[14px] px-[28px] mt-[8px] transition-all duration-[150ms] rounded-lg active:scale-[0.98] h-auto font-sans shadow-lg shadow-[#6366f1]/10 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Authorize Admin Access
                </>
              )}
            </Button>
          </form>
          
          {/* Footer Terms Note */}
          <p className="text-[12px] text-[#8b9ab0]/40 text-center font-sans">
            Internal use only by VFF. Proprietary and Confidential.
          </p>

        </div>
      </div>
    </div>
  );
}
