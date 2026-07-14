'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-brand p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-surface p-8 rounded-2xl border border-border-brand shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-500/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading text-text-primary">Something went wrong!</h1>
          <p className="text-text-secondary text-sm">
            An unexpected error occurred. Please try again.
          </p>
        </div>

        <Button 
          onClick={reset}
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
