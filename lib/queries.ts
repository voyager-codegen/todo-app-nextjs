import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api-client';
import { Todo, TodoInput, ApiError } from '@/types/api';
import { toast } from 'sonner';

// Query keys
export const queryKeys = {
  todos: ['todos'] as const,
  todo: (id: number) => ['todos', id] as const,
};

// Get all todos
export const useGetTodos = () => {
  return useQuery<Todo[], ApiError>({
    queryKey: queryKeys.todos,
    queryFn: () => apiClient.getTodos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get single todo
export const useGetTodo = (id: number) => {
  return useQuery<Todo, ApiError>({
    queryKey: queryKeys.todo(id),
    queryFn: () => apiClient.getTodo(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, ApiError, TodoInput>({
    mutationFn: (todo: TodoInput) => apiClient.createTodo(todo),
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo[]>(queryKeys.todos, (oldTodos) => 
        oldTodos ? [...oldTodos, newTodo] : [newTodo]
      );
      toast.success('Todo created successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create todo');
    },
  });
};

// Update todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, ApiError, { id: number; todo: TodoInput }>({
    mutationFn: ({ id, todo }) => apiClient.updateTodo(id, todo),
    onMutate: async ({ id, todo }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.todos });
      await queryClient.cancelQueries({ queryKey: queryKeys.todo(id) });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(queryKeys.todos);
      const previousTodo = queryClient.getQueryData<Todo>(queryKeys.todo(id));

      // Optimistically update to the new value
      queryClient.setQueryData<Todo[]>(queryKeys.todos, (oldTodos) =>
        oldTodos?.map(t => t.id === id ? { ...t, ...todo } : t)
      );

      queryClient.setQueryData<Todo>(queryKeys.todo(id), (oldTodo) =>
        oldTodo ? { ...oldTodo, ...todo } : undefined
      );

      return { previousTodos, previousTodo };
    },
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(queryKeys.todos, (oldTodos) =>
        oldTodos?.map(t => t.id === updatedTodo.id ? updatedTodo : t)
      );
      queryClient.setQueryData<Todo>(queryKeys.todo(updatedTodo.id), updatedTodo);
      toast.success('Todo updated successfully!');
    },
    onError: (error: ApiError, { id }, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(queryKeys.todos, context.previousTodos);
      }
      if (context?.previousTodo) {
        queryClient.setQueryData<Todo>(queryKeys.todo(id), context.previousTodo);
      }
      toast.error(error.message || 'Failed to update todo');
    },
  });
};

// Delete todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: (id: number) => apiClient.deleteTodo(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.todos });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(queryKeys.todos);

      // Optimistically remove from the list
      queryClient.setQueryData<Todo[]>(queryKeys.todos, (oldTodos) =>
        oldTodos?.filter(t => t.id !== id)
      );

      return { previousTodos };
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.todo(id) });
      toast.success('Todo deleted successfully!');
    },
    onError: (error: ApiError, id, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(queryKeys.todos, context.previousTodos);
      }
      toast.error(error.message || 'Failed to delete todo');
    },
  });
};