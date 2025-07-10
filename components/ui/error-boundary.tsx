'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  error: unknown;
  onRetry: () => void;
  title?: string;
}

export function ErrorBoundary({ error, onRetry, title = 'Something went wrong' }: ErrorBoundaryProps) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'object' && error !== null && 'message' in error 
    ? String(error.message) 
    : 'An unexpected error occurred';

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRetry} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}

