'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getErrorMessage } from '@/lib/utils';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);

    try {
      // Basic register payload
      const mockName = email.split('@')[0];
      const data = await AuthService.register({
        email,
        password,
        name: mockName.charAt(0).toUpperCase() + mockName.slice(1),
        role: 'General Staff'
      });
      
      setAuth(data.user, data.access_token);
      toast.success('Registration successful. Welcome to VFF.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(getErrorMessage(err) || 'Registration failed. Please check details.');
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
            backgroundImage: "url('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80')" 
          }}
          id="visual-pane"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90 via-transparent pointer-events-none" />
          
          {/* Top Row: Logo & Back Button */}
          <div className="relative flex justify-between items-center z-10">
            <span className="text-lg font-extrabold tracking-wider text-white font-heading">
              VFF IMS
            </span>
            <Link 
              href="/"
              className="text-[11px] font-bold text-white/90 hover:text-white bg-black/45 py-2 px-4 rounded-lg flex items-center gap-1 border border-white/10 backdrop-blur-md hover:bg-black/60 transition-all duration-150"
            >
              Back to website →
            </Link>
          </div>

          {/* Bottom Row: Main Caption */}
          <div className="relative z-10 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white font-heading">
              Register staff, <br />
              initialize profiles.
            </h1>
          </div>
        </div>
      </div>

      {/* Right Pane - Form directly on Background */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-20 relative light:bg-[#F8F9FA] bg-bg-brand">
        <div className="w-full max-w-md flex flex-col gap-8">
          
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary font-heading">
              Create an account
            </h2>
            <p className="text-xs text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-[#EF9F27] hover:underline font-semibold">
                Log in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-[14px] text-text-secondary/40" size={16} />
              <Input 
                id="email" 
                type="email" 
                placeholder="Email Address" 
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

            {/* Confirm Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-[14px] text-text-secondary/40" size={16} />
              <Input 
                id="confirm-password" 
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password" 
                className="pl-11 bg-bg-subtle border-border-brand text-text-primary focus:border-[#EF9F27] focus:ring-1 focus:ring-[#EF9F27] h-11 rounded-lg w-full placeholder:text-text-secondary/40 text-xs"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Primary Action Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#EF9F27] hover:bg-[#EF9F27]/80 text-[#0B0D12] font-semibold text-xs py-3 px-6 mt-2 transition-all rounded-lg active:scale-95 h-11 flex items-center justify-center gap-2 border-none shadow-md shadow-[#EF9F27]/10"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Initialize Registry'}
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border-brand" />
            <span className="flex-shrink mx-4 text-[10px] text-text-secondary/45 font-bold uppercase tracking-wider">
              Or register with
            </span>
            <div className="flex-grow border-t border-border-brand" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 py-2.5 border border-border-brand hover:bg-bg-subtle rounded-lg text-xs font-semibold text-text-primary transition-all duration-150"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.85-6.277-6.36s2.81-6.358 6.277-6.358c1.55 0 2.96.57 4.05 1.51l3.11-3.11C18.82 2.05 15.76 1 12.24 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.64 0 11.08-4.66 11.08-11.24 0-.76-.07-1.33-.21-1.96H12.24z"/>
              </svg>
              Google
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 py-2.5 border border-border-brand hover:bg-bg-subtle rounded-lg text-xs font-semibold text-text-primary transition-all duration-150"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.2.12.31.12.87 0 1.99-.57 2.51-1.45z"/>
              </svg>
              Apple
            </button>
          </div>
          
          {/* Footer Terms Note */}
          <p className="text-[10px] text-text-secondary/45 text-center">
            Internal use only by VFF. Proprietary and Confidential.
          </p>

        </div>
      </div>
    </div>
  );
}
