import axios, { AxiosInstance, AxiosError } from 'axios';
import { Todo, TodoInput, ApiError } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'An error occurred',
          status: error.response?.status || 500,
          details: error.response?.data,
        };

        // Handle common error cases
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Todo API methods
  async getTodos(): Promise<Todo[]> {
    const response = await this.client.get<Todo[]>('/todos');
    return response.data;
  }

  async createTodo(todo: TodoInput): Promise<Todo> {
    const response = await this.client.post<Todo>('/todos', todo);
    return response.data;
  }

  async getTodo(id: number): Promise<Todo> {
    const response = await this.client.get<Todo>(`/todos/${id}`);
    return response.data;
  }

  async updateTodo(id: number, todo: TodoInput): Promise<Todo> {
    const response = await this.client.put<Todo>(`/todos/${id}`, todo);
    return response.data;
  }

  async deleteTodo(id: number): Promise<void> {
    await this.client.delete(`/todos/${id}`);
  }
}

export const apiClient = new ApiClient();