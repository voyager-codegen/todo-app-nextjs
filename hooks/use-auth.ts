'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useLogin, useRegister, useLogout } from '@/lib/queries';
import { LoginRequest, RegisterRequest } from '@/types/api';

export function useAuthActions() {
  const { setUser } = useAuth();
  const router = useRouter();
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (data: LoginRequest) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      
      // Set user in context
      setUser({ email: data.email });
      
      // Redirect to dashboard
      router.push('/dashboard');
      
      return response;
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await registerMutation.mutateAsync(data);
      
      // Redirect to login page after successful registration
      router.push('/auth/login');
      
      return response;
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      
      // Clear user from context
      setUser(null);
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
    }
  };

  return {
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}

