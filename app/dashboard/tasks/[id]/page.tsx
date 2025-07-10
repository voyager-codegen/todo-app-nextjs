'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useGetTask } from '@/lib/queries';
import { TaskDetail } from '@/components/tasks/task-detail';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const { data: task, isLoading, error, refetch } = useGetTask(taskId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
          <p className="text-muted-foreground">
            View and manage task details
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <ErrorBoundary 
          error={error} 
          onRetry={() => refetch()} 
          title="Failed to load task"
        />
      ) : task ? (
        <TaskDetail task={task} />
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Task not found</p>
        </div>
      )}
    </div>
  );
}

