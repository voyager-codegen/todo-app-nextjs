import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api-client';
import {
  Task,
  TaskList,
  CreateTaskRequest,
  UpdateTaskRequest,
  CalendarView,
  TaskReport,
  TaskExport,
  TaskImport,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserPreferences,
  UpdatePreferencesRequest,
  ApiError,
  TaskQueryParams,
  ReportQueryParams
} from '@/types/api';
import { toast } from 'sonner';

// Query keys
export const queryKeys = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  completedTasks: ['tasks', 'completed'] as const,
  calendarView: ['tasks', 'calendar'] as const,
  taskReport: (period?: string) => ['tasks', 'report', period] as const,
  userPreferences: ['user', 'preferences'] as const,
  taskExport: ['user', 'export'] as const,
};

// Authentication mutations
export const useRegister = () => {
  return useMutation<AuthResponse, ApiError, RegisterRequest>({
    mutationFn: (data: RegisterRequest) => apiClient.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Please log in.');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: (data: LoginRequest) => apiClient.login(data),
    onSuccess: () => {
      toast.success('Login successful!');
      queryClient.invalidateQueries();
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logout successful!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Logout failed');
    },
  });
};

// Task queries and mutations
export const useGetTasks = (params?: TaskQueryParams) => {
  return useQuery<TaskList, ApiError>({
    queryKey: [...queryKeys.tasks, params],
    queryFn: () => apiClient.getTasks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetTask = (id: string) => {
  return useQuery<Task, ApiError>({
    queryKey: queryKeys.task(id),
    queryFn: () => apiClient.getTask(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, CreateTaskRequest>({
    mutationFn: (task: CreateTaskRequest) => apiClient.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      toast.success('Task created successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, { id: string; task: UpdateTaskRequest }>({
    mutationFn: ({ id, task }) => apiClient.updateTask(id, task),
    onMutate: async ({ id, task }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks });
      await queryClient.cancelQueries({ queryKey: queryKeys.task(id) });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<TaskList>(queryKeys.tasks);
      const previousTask = queryClient.getQueryData<Task>(queryKeys.task(id));

      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData<TaskList>(queryKeys.tasks, {
          ...previousTasks,
          tasks: previousTasks.tasks.map(t => 
            t.id === id ? { ...t, ...task } as Task : t
          )
        });
      }

      if (previousTask) {
        queryClient.setQueryData<Task>(queryKeys.task(id), {
          ...previousTask,
          ...task
        });
      }

      return { previousTasks, previousTask };
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.task(updatedTask.id) });
      toast.success('Task updated successfully!');
    },
    onError: (error: ApiError, { id }, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData<TaskList>(queryKeys.tasks, context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData<Task>(queryKeys.task(id), context.previousTask);
      }
      toast.error(error.message || 'Failed to update task');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (id: string) => apiClient.deleteTask(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<TaskList>(queryKeys.tasks);

      // Optimistically remove from the list
      if (previousTasks) {
        queryClient.setQueryData<TaskList>(queryKeys.tasks, {
          ...previousTasks,
          tasks: previousTasks.tasks.filter(t => t.id !== id),
          totalCount: previousTasks.totalCount - 1
        });
      }

      return { previousTasks };
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.removeQueries({ queryKey: queryKeys.task(id) });
      toast.success('Task deleted successfully!');
    },
    onError: (error: ApiError, id, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData<TaskList>(queryKeys.tasks, context.previousTasks);
      }
      toast.error(error.message || 'Failed to delete task');
    },
  });
};

export const useGetCompletedTasks = () => {
  return useQuery<TaskList, ApiError>({
    queryKey: queryKeys.completedTasks,
    queryFn: () => apiClient.getCompletedTasks(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetCalendarView = () => {
  return useQuery<CalendarView, ApiError>({
    queryKey: queryKeys.calendarView,
    queryFn: () => apiClient.getCalendarView(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGetTaskReport = (params?: ReportQueryParams) => {
  return useQuery<TaskReport, ApiError>({
    queryKey: queryKeys.taskReport(params?.period),
    queryFn: () => apiClient.getTaskReport(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User preferences queries and mutations
export const useGetUserPreferences = () => {
  return useQuery<UserPreferences, ApiError>({
    queryKey: queryKeys.userPreferences,
    queryFn: () => apiClient.getUserPreferences(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation<UserPreferences, ApiError, UpdatePreferencesRequest>({
    mutationFn: (preferences: UpdatePreferencesRequest) => apiClient.updateUserPreferences(preferences),
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(queryKeys.userPreferences, updatedPreferences);
      toast.success('Preferences updated successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update preferences');
    },
  });
};

// Import/Export mutations
export const useExportTasks = () => {
  return useMutation<TaskExport, ApiError, void>({
    mutationFn: () => apiClient.exportTasks(),
    onSuccess: () => {
      toast.success('Tasks exported successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to export tasks');
    },
  });
};

export const useImportTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<TaskList, ApiError, TaskImport>({
    mutationFn: (data: TaskImport) => apiClient.importTasks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      toast.success('Tasks imported successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to import tasks');
    },
  });
};

