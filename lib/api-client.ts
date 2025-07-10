import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
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

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com/v1',
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Handle token refresh on 401 errors
        if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              // Implement token refresh logic here
              // For now, just redirect to login
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/auth/login';
            } else {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/auth/login';
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          status: error.response?.status || 500,
          details: error.response?.data,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Authentication API methods
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    
    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Task API methods
  async getTasks(params?: TaskQueryParams): Promise<TaskList> {
    const response = await this.client.get<TaskList>('/tasks', { params });
    return response.data;
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await this.client.post<Task>('/tasks', task);
    return response.data;
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.client.get<Task>(`/tasks/${id}`);
    return response.data;
  }

  async updateTask(id: string, task: UpdateTaskRequest): Promise<Task> {
    const response = await this.client.patch<Task>(`/tasks/${id}`, task);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  async getCompletedTasks(): Promise<TaskList> {
    const response = await this.client.get<TaskList>('/tasks/completed');
    return response.data;
  }

  async getCalendarView(): Promise<CalendarView> {
    const response = await this.client.get<CalendarView>('/tasks/calendar');
    return response.data;
  }

  async getTaskReport(params?: ReportQueryParams): Promise<TaskReport> {
    const response = await this.client.get<TaskReport>('/tasks/report', { params });
    return response.data;
  }

  // User preferences API methods
  async getUserPreferences(): Promise<UserPreferences> {
    const response = await this.client.get<UserPreferences>('/user/preferences');
    return response.data;
  }

  async updateUserPreferences(preferences: UpdatePreferencesRequest): Promise<UserPreferences> {
    const response = await this.client.patch<UserPreferences>('/user/preferences', preferences);
    return response.data;
  }

  // Import/Export API methods
  async exportTasks(): Promise<TaskExport> {
    const response = await this.client.get<TaskExport>('/user/export');
    return response.data;
  }

  async importTasks(data: TaskImport): Promise<TaskList> {
    const response = await this.client.post<TaskList>('/user/import', data);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();

