'use client';

import { useState } from 'react';
import { useGetTasks } from '@/lib/queries';
import { TaskQueryParams } from '@/types/api';
import { TaskItem } from '@/components/tasks/task-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface TaskListProps {
  filters?: TaskQueryParams;
}

export function TaskList({ filters }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState(filters?.search || '');
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useGetTasks({
    ...filters,
    search: searchQuery || undefined,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        onRetry={() => refetch()} 
        title="Failed to load tasks"
      />
    );
  }
  
  if (!data || data.tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">No tasks found</p>
        <p className="text-sm text-muted-foreground">
          {filters?.search 
            ? "Try adjusting your search or filters" 
            : "Create a new task to get started"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className="sr-only">
          Search
        </Button>
      </form>
      
      <div className="divide-y">
        {data.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      
      <div className="text-sm text-muted-foreground text-center pt-2">
        Showing {data.tasks.length} of {data.totalCount} tasks
      </div>
    </div>
  );
}

