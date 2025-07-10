'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, isPast, isToday } from 'date-fns';
import { Task, UpdateTaskRequest } from '@/types/api';
import { useUpdateTask, useDeleteTask } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TaskForm } from '@/components/tasks/task-form';
import { Calendar, Clock, Pencil, Trash } from 'lucide-react';

interface TaskDetailProps {
  task: Task;
}

export function TaskDetail({ task }: TaskDetailProps) {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const handleStatusChange = async (checked: boolean) => {
    const updateData: UpdateTaskRequest = {
      status: checked ? 'completed' : 'pending',
    };
    
    await updateTask.mutateAsync({
      id: task.id,
      task: updateData,
    });
  };
  
  const handleDelete = async () => {
    await deleteTask.mutateAsync(task.id);
    setIsDeleteDialogOpen(false);
    router.push('/dashboard/tasks');
  };
  
  const dueDate = new Date(task.dueDate);
  const isOverdue = task.status !== 'completed' && isPast(dueDate) && !isToday(dueDate);
  
  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return 'Medium';
    }
  };
  
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 2:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 3:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={task.status === 'completed'}
              onCheckedChange={handleStatusChange}
              aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
            />
            <CardTitle className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
              {task.title}
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Description</h3>
            <p className={`text-sm ${
              task.status === 'completed' ? 'text-muted-foreground' : 'text-foreground'
            }`}>
              {task.description}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Due Date</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {format(dueDate, 'MMM d, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{format(dueDate, 'h:mm a')}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Created</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        
        {task.updatedAt !== task.createdAt && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Last Updated</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Task</SheetTitle>
              <SheetDescription>
                Make changes to your task
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <TaskForm 
                task={task} 
                onSuccess={() => setIsEditSheetOpen(false)} 
              />
            </div>
          </SheetContent>
        </Sheet>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

