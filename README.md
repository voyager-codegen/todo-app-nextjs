# Todo App - Rails API Integration

A full-stack Next.js application that integrates with a Ruby on Rails API backend for managing todo tasks.

## Features

- **Type-safe API Integration**: Generated from Swagger/OpenAPI specification
- **React Query**: Efficient data fetching, caching, and synchronization
- **Optimistic Updates**: Immediate UI updates with rollback on errors
- **Real-time Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Form Validation**: Client-side validation with proper error messages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: shadcn/ui components with smooth animations

## Tech Stack

- **Frontend**: Next.js 13.5, React 18, TypeScript
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

## API Integration

The application integrates with a Ruby on Rails API that provides:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a specific todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API configuration
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Client Features

- **Automatic Retries**: Configurable retry logic with exponential backoff
- **Request/Response Interceptors**: Authentication, error handling, and logging
- **Type Safety**: Full TypeScript support with generated types
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Caching**: Smart caching with React Query for optimal performance

## Project Structure

```
├── app/                  # Next.js app router
├── components/          # React components
│   ├── providers/       # React Query provider
│   ├── todos/          # Todo-specific components
│   └── ui/             # Reusable UI components
├── lib/                # Utility libraries
│   ├── api-client.ts   # API client configuration
│   ├── queries.ts      # React Query hooks
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
└── middleware.ts       # Next.js middleware for CORS
```

## Development

The application includes:
- React Query DevTools for debugging
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Responsive design patterns

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Error Handling

The application implements comprehensive error handling:
- API client interceptors for global error handling
- React Query error boundaries
- User-friendly error messages
- Automatic retry mechanisms
- Optimistic updates with rollback# todo-app-nextjs
