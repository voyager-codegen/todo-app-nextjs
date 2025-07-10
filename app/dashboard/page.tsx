import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, CheckCircle, ListTodo, PieChart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Todo App',
  description: 'Manage your tasks efficiently',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your task management dashboard
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tasks">
            <ListTodo className="mr-2 h-4 w-4" />
            View All Tasks
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              All your tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Tasks you've completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Tasks still to do
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Tasks past their due date
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Quickly access common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-20 justify-start">
              <Link href="/dashboard/tasks" className="flex flex-col items-start">
                <span className="font-semibold">View Tasks</span>
                <span className="text-xs text-muted-foreground">
                  See all your tasks in one place
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 justify-start">
              <Link href="/dashboard/tasks" className="flex flex-col items-start">
                <span className="font-semibold">Create Task</span>
                <span className="text-xs text-muted-foreground">
                  Add a new task to your list
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 justify-start">
              <Link href="/dashboard/calendar" className="flex flex-col items-start">
                <span className="font-semibold">Calendar View</span>
                <span className="text-xs text-muted-foreground">
                  See your tasks in a calendar
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 justify-start">
              <Link href="/dashboard/reports" className="flex flex-col items-start">
                <span className="font-semibold">Task Reports</span>
                <span className="text-xs text-muted-foreground">
                  View reports and analytics
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>
              Quick links to important sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard/tasks">
                <ListTodo className="mr-2 h-4 w-4" />
                Tasks
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard/calendar">
                <CalendarDays className="mr-2 h-4 w-4" />
                Calendar
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard/reports">
                <PieChart className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/dashboard/preferences">
                <ListTodo className="mr-2 h-4 w-4" />
                Preferences
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

