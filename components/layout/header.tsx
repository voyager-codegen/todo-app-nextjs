'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Moon, Sun, Bell } from 'lucide-react';
import { useAuthActions } from '@/hooks/use-auth';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useGetUserPreferences, useUpdateUserPreferences } from '@/lib/queries';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout } = useAuthActions();
  
  const { data: preferences } = useGetUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  
  const toggleTheme = () => {
    if (preferences) {
      const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
      updatePreferences.mutate({ theme: newTheme });
    }
  };
  
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Todo App</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link 
            href="/dashboard/tasks" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname?.startsWith('/dashboard/tasks') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            Tasks
          </Link>
          <Link 
            href="/dashboard/calendar" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname?.startsWith('/dashboard/calendar') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            Calendar
          </Link>
          <Link 
            href="/dashboard/reports" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname?.startsWith('/dashboard/reports') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            Reports
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={`Switch to ${preferences?.theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {preferences?.theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.email && (
                    <p className="font-medium">{user.email}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/preferences" className="cursor-pointer w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Preferences</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
            <Link 
              href="/dashboard/tasks" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname?.startsWith('/dashboard/tasks') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tasks
            </Link>
            <Link 
              href="/dashboard/calendar" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname?.startsWith('/dashboard/calendar') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link 
              href="/dashboard/reports" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname?.startsWith('/dashboard/reports') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </Link>
            <Link 
              href="/dashboard/preferences" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname?.startsWith('/dashboard/preferences') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Preferences
            </Link>
            <button 
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

