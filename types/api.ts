// Generated types from Swagger API specification
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoInput {
  title: string;
  completed?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// API operation types
export type GetTodosResponse = Todo[];
export type CreateTodoResponse = Todo;
export type GetTodoResponse = Todo;
export type UpdateTodoResponse = Todo;
export type DeleteTodoResponse = void;