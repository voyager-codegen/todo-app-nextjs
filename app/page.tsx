import { TodoForm } from '@/components/todos/todo-form';
import { TodoList } from '@/components/todos/todo-list';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todo App
          </h1>
          <p className="text-lg text-gray-600">
            Full-stack Next.js application with Rails API integration
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TodoForm />
          </div>
          <div className="lg:col-span-2">
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}