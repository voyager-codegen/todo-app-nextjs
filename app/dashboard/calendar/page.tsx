'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { CalendarView } from '@/components/calendar/calendar-view';
import { TaskForm } from '@/components/tasks/task-form';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export default function CalendarPage() {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View your tasks in a calendar format
          </p>
        </div>
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
                Add a new task to your calendar
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <TaskForm onSuccess={() => setIsCreateSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="p-4">
        <CalendarView />
      </Card>
    </div>
  );
}

