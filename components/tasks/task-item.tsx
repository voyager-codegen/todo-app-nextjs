'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, isPast, isToday } from 'date-fns';
import { Task, UpdateTaskRequest } from '@/types/api';
import { useUpdateTask, useDeleteTask } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TaskForm } from '@/components/tasks/task-form';
import { Calendar, Clock, MoreVertical, Pencil, Trash } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    <div className="py-4 flex items-start gap-4">
      <div className="pt-1">
        <Checkbox 
          checked={task.status === 'completed'}
          onCheckedChange={handleStatusChange}
          aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Link 
            href={`/dashboard/tasks/${task.id}`}
            className={`text-lg font-medium hover:underline ${
              task.status === 'completed' ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.title}
          </Link>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
            
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </div>
        
        {task.description && (
          <p className={`mt-1 text-sm ${
            task.status === 'completed' ? 'text-muted-foreground' : 'text-foreground'
          }`}>
            {task.description}
          </p>
        )}
        
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
      
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
              <SheetTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
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
            
            <DropdownMenuSeparator />
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

