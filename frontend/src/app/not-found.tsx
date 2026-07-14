'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-brand p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-surface p-8 rounded-2xl border border-border-brand shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <ShieldAlert className="w-12 h-12 text-rose-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading text-text-primary">404 - Not Found</h1>
          <p className="text-text-secondary text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link href="/dashboard" className="block w-full">
          <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
