'use client';

import { useState } from 'react';
import { Todo } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useUpdateTodo, useDeleteTodo } from '@/lib/queries';
import { Trash2, Edit2, Save, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editError, setEditError] = useState('');

  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleToggleComplete = async () => {
    try {
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        todo: { ...todo, completed: !todo.completed },
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim();
    
    if (!trimmedTitle) {
      setEditError('Title is required');
      return;
    }
    
    if (trimmedTitle.length < 3) {
      setEditError('Title must be at least 3 characters');
      return;
    }
    
    if (trimmedTitle.length > 100) {
      setEditError('Title must be less than 100 characters');
      return;
    }

    try {
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        todo: { ...todo, title: trimmedTitle },
      });
      setIsEditing(false);
      setEditError('');
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditError('');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodoMutation.mutateAsync(todo.id);
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={updateTodoMutation.isPending}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={editError ? 'border-red-500' : ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit();
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                />
                {editError && (
                  <p className="text-sm text-red-500">{editError}</p>
                )}
              </div>
            ) : (
              <div>
                <p
                  className={`text-sm font-medium ${
                    todo.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}
                >
                  {todo.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {todo.id} • {todo.completed ? 'Completed' : 'Pending'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  disabled={updateTodoMutation.isPending}
                >
                  {updateTodoMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={updateTodoMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  disabled={updateTodoMutation.isPending || deleteTodoMutation.isPending}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={updateTodoMutation.isPending || deleteTodoMutation.isPending}
                >
                  {deleteTodoMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}