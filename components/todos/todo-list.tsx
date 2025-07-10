'use client';

import { useGetTodos } from '@/lib/queries';
import { TodoItem } from './todo-item';
import { TodoListSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';

export function TodoList() {
  const { data: todos, isLoading, error, refetch } = useGetTodos();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Loading Todos...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TodoListSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Todo List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorBoundary
            error={error}
            onRetry={() => refetch()}
            title="Failed to load todos"
          />
        </CardContent>
      </Card>
    );
  }

  const completedCount = todos?.filter(todo => todo.completed).length || 0;
  const totalCount = todos?.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Todo List
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {completedCount} completed
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Circle className="h-3 w-3" />
              {totalCount - completedCount} pending
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!todos || todos.length === 0 ? (
          <div className="text-center py-8">
            <Circle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No todos yet. Create your first todo!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}