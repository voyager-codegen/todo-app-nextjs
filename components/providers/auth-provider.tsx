'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if access token exists in localStorage
        const token = localStorage.getItem('access_token');
        
        if (token) {
          // For now, we'll just set a dummy user
          // In a real app, you would validate the token with the server
          setUser({ email: 'user@example.com' });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname?.startsWith('/auth/');
      const isDashboardRoute = pathname?.startsWith('/dashboard');
      
      if (!user && isDashboardRoute) {
        // Redirect to login if trying to access protected routes without authentication
        router.push('/auth/login');
      } else if (user && isAuthRoute) {
        // Redirect to dashboard if already authenticated and trying to access auth routes
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

