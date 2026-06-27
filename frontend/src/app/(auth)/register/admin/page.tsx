'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth.service';

export default function AdminRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await AuthService.register({ email, password, role_id: 1 }); // 1 is Admin
      toast.success('Administrator account initialized successfully');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to initialize administrator registry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#13111c] text-white font-sans selection:bg-[#6366f1]/30 overflow-hidden">
      
      {/* Left Pane - Inset Veterinary Care Visuals Container */}
      <div className="hidden md:flex p-[24px] h-full w-full">
        <div 
          className="relative flex-1 flex flex-col justify-between p-[40px] bg-cover bg-center rounded-2xl overflow-hidden border border-[#252236]/30 shadow-2xl"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80')" 
          }}
          id="visual-pane"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#13111c]/60 via-transparent to-[#13111c]/95 pointer-events-none" />
          
          {/* Top Row: Back link & Title */}
          <div className="relative z-10 flex justify-between items-center w-full">
            <Link 
              href="/" 
              className="inline-flex items-center gap-[8px] text-[13px] text-[#8b9ab0] hover:text-white transition-colors duration-150 group font-medium"
              id="back-to-website-btn"
            >
              <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-150" />
              <span>Back to website</span>
            </Link>
            <span className="text-[12px] font-mono tracking-widest text-[#6366f1] font-semibold bg-[#6366f1]/10 px-3 py-1 rounded-full border border-[#6366f1]/20">
              VFF SYSTEM
            </span>
          </div>

          {/* Bottom Row: Main Caption & Slide Indicators */}
          <div className="relative z-10 space-y-[32px]">
            <h1 className="text-[32px] lg:text-[40px] font-bold leading-[1.2] tracking-tight text-white font-sans">
              System Admin, <br />
              initialize registry.
            </h1>
            
            {/* Indicators */}
            <div className="flex gap-[8px] items-center">
              <span className="h-[2px] w-[32px] bg-white/35 rounded-full transition-all duration-200" />
              <span className="h-[2px] w-[32px] bg-white rounded-full transition-all duration-200" />
              <span className="h-[2px] w-[32px] bg-white/35 rounded-full transition-all duration-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form directly on Background */}
      <div className="flex items-center justify-center p-[24px] md:p-[48px] lg:p-[80px] relative">
        <div className="w-full max-w-md flex flex-col gap-[32px]">
          
          {/* Header */}
          <div className="space-y-[8px]">
            <h2 className="text-[32px] font-bold tracking-tight text-white font-sans">
              Create an administrator account
            </h2>
            <p className="text-[14px] text-[#8b9ab0] font-sans">
              Already have an admin account?{' '}
              <Link href="/login/admin" className="text-[#6366f1] hover:underline font-semibold">
                Log in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-[16px]">
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
                placeholder="Admin Password" 
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

            {/* Confirm Password Field */}
            <div className="relative">
              <Lock className="absolute left-[16px] top-[14px] text-[#8b9ab0]/50" size={18} />
              <Input 
                id="confirm-password" 
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Admin Password" 
                className="pl-11 bg-[#1c1a27] border-[#252236] text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] h-12 rounded-lg font-sans w-full placeholder:text-[#8b9ab0]/40"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Primary Action Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-[#ffffff] font-semibold text-[15px] py-[14px] px-[28px] mt-[8px] transition-all duration-[150ms] rounded-lg active:scale-[0.98] h-auto font-sans shadow-lg shadow-[#6366f1]/10"
              disabled={loading}
            >
              {loading ? 'Creating Admin Account...' : 'Initialize Admin Registry'}
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#252236]" />
            <span className="flex-shrink mx-4 text-[12px] text-[#8b9ab0]/50 font-medium font-sans uppercase tracking-wider">
              Or initialize with
            </span>
            <div className="flex-grow border-t border-[#252236]" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 py-3 border border-[#252236] hover:bg-[#1c1a27] rounded-lg text-[14px] font-semibold text-white font-sans transition-all duration-150"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.358 6.277-6.358c1.55 0 2.96.57 4.05 1.51l3.11-3.11C18.82 2.05 15.76 1 12.24 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.64 0 11.08-4.66 11.08-11.24 0-.76-.07-1.33-.21-1.96H12.24z"/>
              </svg>
              Google
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 py-3 border border-[#252236] hover:bg-[#1c1a27] rounded-lg text-[14px] font-semibold text-white font-sans transition-all duration-150"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.2.12.31.12.87 0 1.99-.57 2.51-1.45z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Footer Terms Note */}
          <p className="text-[12px] text-[#8b9ab0]/40 text-center font-sans">
            Internal administrative configuration portal. Confidential.
          </p>

        </div>
      </div>
    </div>
  );
}
