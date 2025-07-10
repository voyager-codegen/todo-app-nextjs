# Todo App

A modern task management application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Complete UI implementation for all API endpoints
- Modern, responsive design with clean UX/UI
- Proper routing and navigation structure
- State management with React Query
- API integration with proper error handling
- Authentication and authorization flows
- Form validation with Zod
- Loading states and error boundaries
- Comprehensive component library with shadcn/ui
- Docker configuration
- Environment configuration
- Build optimization and deployment setup

## Technical Stack

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query (TanStack Query)
- Zod for validation
- Recharts for data visualization
- date-fns for date manipulation

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app router pages
- `/components`: Reusable UI components
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and API client
- `/types`: TypeScript type definitions

## Docker Deployment

1. Build the Docker image:

```bash
docker build -t todo-app .
```

2. Run the container:

```bash
docker run -p 3000:3000 todo-app
```

Alternatively, use Docker Compose:

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | API base URL | `https://api.example.com/v1` |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout in ms | `10000` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Todo App` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `false` |

## License

This project is licensed under the MIT License - see the LICENSE file for details.

