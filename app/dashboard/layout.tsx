import { Metadata } from 'next';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Dashboard | Todo App',
  description: 'Manage your tasks efficiently',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Todo App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

