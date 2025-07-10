'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter } from 'lucide-react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskFilter } from '@/components/tasks/task-filter';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TaskQueryParams } from '@/types/api';

export default function TasksPage() {
  const searchParams = useSearchParams();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<TaskQueryParams>({
    status: searchParams.get('status') as TaskQueryParams['status'] || undefined,
    sortBy: searchParams.get('sortBy') as TaskQueryParams['sortBy'] || undefined,
    search: searchParams.get('search') || undefined,
  });

  const handleFilterChange = (newFilters: TaskQueryParams) => {
    setFilters(newFilters);
    setIsFilterSheetOpen(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'all') {
      setFilters({ ...filters, status: undefined });
    } else if (value === 'pending') {
      setFilters({ ...filters, status: 'pending' });
    } else if (value === 'completed') {
      setFilters({ ...filters, status: 'completed' });
    } else if (value === 'overdue') {
      setFilters({ ...filters, status: 'overdue' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        <div className="flex gap-2">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Tasks</SheetTitle>
                <SheetDescription>
                  Apply filters to your task list
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <TaskFilter 
                  currentFilters={filters} 
                  onFilterChange={handleFilterChange} 
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create Task</SheetTitle>
                <SheetDescription>
                  Add a new task to your list
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <TaskForm onSuccess={() => setIsCreateSheetOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card className="mt-4">
            <TaskList filters={filters} />
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card className="mt-4">
            <TaskList filters={{ ...filters, status: 'pending' }} />
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card className="mt-4">
            <TaskList filters={{ ...filters, status: 'completed' }} />
          </Card>
        </TabsContent>
        <TabsContent value="overdue">
          <Card className="mt-4">
            <TaskList filters={{ ...filters, status: 'overdue' }} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

