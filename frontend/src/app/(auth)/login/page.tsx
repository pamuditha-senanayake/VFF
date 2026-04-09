'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await AuthService.login({ email, password });
      setAuth(data.user, data.access_token);
      toast.success('Access granted. Welcome back.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,58,138,0.3),transparent_70%)] pointer-events-none" />
      
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
        
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="mx-auto bg-blue-600/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">VFF Integrated System</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access the management panel.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@vff.org" 
                  className="pl-10 bg-slate-950 border-slate-800 text-white focus:ring-blue-600 focus:border-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Link href="#" className="text-xs text-blue-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10 bg-slate-950 border-slate-800 text-white focus:ring-blue-600 focus:border-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-6 mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn size={18} />
                  Authorize Access
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-center text-sm">
            <span className="text-slate-400">Need a system account? </span>
            <Link href="/register" className="text-blue-500 hover:text-blue-400 font-medium">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
        <Server className="h-3 w-3" />
        <span>Secure Environment Node-01</span>
      </div>
    </div>
  );
}

function Server(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}
