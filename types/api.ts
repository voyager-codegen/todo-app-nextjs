// Generated types from Swagger API specification

// Task related types
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date-time format
  priority: 1 | 2 | 3;
  status: 'pending' | 'completed' | 'overdue';
  createdAt: string; // ISO date-time format
  updatedAt: string; // ISO date-time format
}

export interface TaskList {
  tasks: Task[];
  totalCount: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate: string; // ISO date-time format
  priority: 1 | 2 | 3;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string; // ISO date-time format
  priority?: 1 | 2 | 3;
  status?: 'pending' | 'completed';
}

export interface CalendarView {
  events: Task[];
}

export interface TaskReport {
  completedTasks: number;
  overdueTasks: number;
  taskProgress: number; // float
}

export interface TaskExport {
  tasks: Task[];
}

export interface TaskImport {
  tasks: Task[];
}

// Authentication related types
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// User preferences related types
export interface UserPreferences {
  theme: 'light' | 'dark';
  taskViewLayout: 'list' | 'board';
}

export interface UpdatePreferencesRequest {
  theme?: 'light' | 'dark';
  taskViewLayout?: 'list' | 'board';
}

// Error response type
export interface ErrorResponse {
  error: string;
  message: string;
}

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// API error type
export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// Query parameters
export interface TaskQueryParams {
  status?: 'pending' | 'completed' | 'overdue';
  sortBy?: 'dueDate' | 'priority' | 'createdAt';
  search?: string;
}

export interface ReportQueryParams {
  period?: 'weekly' | 'monthly';
}

