'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck, User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleMode, setRoleMode] = useState<'Director' | 'Admin'>('Director');
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
      await AuthService.register({ 
        email, 
        password,
        role_id: roleMode === 'Admin' ? 1 : 2 
      });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2),transparent_70%)] pointer-events-none" />
      
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
        
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="mx-auto bg-blue-600/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Join the System</CardTitle>
          <CardDescription className="text-slate-400">
            Create your account to start managing resources.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 bg-slate-950 border-slate-800 text-white focus:ring-blue-600 focus:border-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                <Input 
                  id="confirm-password" 
                  type="password" 
                  className="pl-10 bg-slate-950 border-slate-800 text-white focus:ring-blue-600 focus:border-blue-600"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
               <Label className="text-slate-300">Access Level</Label>
               <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button"
                    variant={roleMode === 'Director' ? 'default' : 'outline'}
                    className={roleMode === 'Director' ? 'bg-blue-600' : 'border-slate-800'}
                    onClick={() => setRoleMode('Director')}
                  >
                    Director
                  </Button>
                  <Button 
                    type="button"
                    variant={roleMode === 'Admin' ? 'default' : 'outline'}
                    className={roleMode === 'Admin' ? 'bg-blue-600' : 'border-slate-800'}
                    onClick={() => setRoleMode('Admin')}
                  >
                    Admin
                  </Button>
               </div>
               <p className="text-[10px] text-slate-500 mt-1 italic">
                 Note: Admin access requires manual system verification after registration.
               </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-6 mt-4"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Initialize Registry'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-center text-sm">
            <span className="text-slate-400">Already have an account? </span>
            <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
              Log in here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
