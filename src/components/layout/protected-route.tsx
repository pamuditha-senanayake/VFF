'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    } else if (isAuthenticated && pathname === '/login') {
      router.push('/dashboard');
    } else if (isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/dashboard'); // Or an unauthorized page
    }
  }, [isAuthenticated, user, router, pathname, allowedRoles]);

  if (!isAuthenticated && pathname !== '/login') {
    return null; // Or a loading skeleton
  }

  return <>{children}</>;
}
