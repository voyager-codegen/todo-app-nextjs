'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useCreateTask, useUpdateTask } from '@/lib/queries';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  priority: z.enum(['1', '2', '3'], {
    required_error: 'Priority is required',
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  
  const isEditing = !!task;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
      priority: task?.priority?.toString() as '1' | '2' | '3' || '2',
    },
  });
  
  const dueDate = watch('dueDate');
  
  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (isEditing && task) {
        const updateData: UpdateTaskRequest = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate.toISOString(),
          priority: parseInt(data.priority) as 1 | 2 | 3,
        };
        
        await updateTask.mutateAsync({
          id: task.id,
          task: updateData,
        });
      } else {
        const createData: CreateTaskRequest = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate.toISOString(),
          priority: parseInt(data.priority) as 1 | 2 | 3,
        };
        
        await createTask.mutateAsync(createData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };
  
  const isPending = createTask.isPending || updateTask.isPending;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Task title"
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
          disabled={isPending}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Task description (optional)"
          {...register('description')}
          className="min-h-[100px]"
          disabled={isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !dueDate && 'text-muted-foreground',
                errors.dueDate && 'border-red-500'
              )}
              disabled={isPending}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                if (date) {
                  setValue('dueDate', date);
                  setIsDatePickerOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dueDate && (
          <p className="text-sm text-red-500">{errors.dueDate.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Priority</Label>
        <RadioGroup
          defaultValue={task?.priority?.toString() || '2'}
          onValueChange={(value) => setValue('priority', value as '1' | '2' | '3')}
          className="flex space-x-4"
          disabled={isPending}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="priority-high" />
            <Label htmlFor="priority-high" className="font-normal">High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="priority-medium" />
            <Label htmlFor="priority-medium" className="font-normal">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="priority-low" />
            <Label htmlFor="priority-low" className="font-normal">Low</Label>
          </div>
        </RadioGroup>
        {errors.priority && (
          <p className="text-sm text-red-500">{errors.priority.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          isEditing ? 'Update Task' : 'Create Task'
        )}
      </Button>
    </form>
  );
}

