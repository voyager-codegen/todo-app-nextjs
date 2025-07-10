'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Task } from '@/types/api';

interface EventItemProps {
  event: Task;
}

export function EventItem({ event }: EventItemProps) {
  const dueDate = parseISO(event.dueDate);
  
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'line-through opacity-50';
      case 'overdue':
        return 'text-red-500';
      default:
        return '';
    }
  };
  
  return (
    <Link 
      href={`/dashboard/tasks/${event.id}`}
      className={`block text-xs p-1 rounded truncate border-l-2 ${getPriorityColor(event.priority)} hover:bg-accent ${getStatusColor(event.status)}`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate">{event.title}</span>
        <span className="text-muted-foreground ml-1 shrink-0">
          {format(dueDate, 'h:mm a')}
        </span>
      </div>
    </Link>
  );
}

