'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useGetCalendarView } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { EventItem } from '@/components/calendar/event-item';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { 
    data: calendarData, 
    isLoading, 
    error, 
    refetch 
  } = useGetCalendarView();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
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
        title="Failed to load calendar"
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={previousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={goToToday}>
          Today
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div 
            key={day} 
            className="bg-background p-2 text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {monthDays.map((day) => {
          // Get events for this day
          const dayEvents = calendarData?.events.filter((event) => 
            isSameDay(parseISO(event.dueDate), day)
          ) || [];
          
          return (
            <div 
              key={day.toString()} 
              className={`bg-background min-h-[100px] p-2 ${
                !isSameMonth(day, currentMonth) 
                  ? 'text-muted-foreground' 
                  : isToday(day)
                  ? 'bg-primary/5'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${
                  isToday(day) ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center' : ''
                }`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                {dayEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

