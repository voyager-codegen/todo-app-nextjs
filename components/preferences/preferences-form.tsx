'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Moon, Sun } from 'lucide-react';
import { useGetUserPreferences, useUpdateUserPreferences } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark']),
  taskViewLayout: z.enum(['list', 'board']),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export function PreferencesForm() {
  const { 
    data: preferences, 
    isLoading, 
    error, 
    refetch 
  } = useGetUserPreferences();
  
  const updatePreferences = useUpdateUserPreferences();
  
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: 'light',
      taskViewLayout: 'list',
    },
  });
  
  // Update form values when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setValue('theme', preferences.theme, { shouldDirty: false });
      setValue('taskViewLayout', preferences.taskViewLayout, { shouldDirty: false });
    }
  }, [preferences, setValue]);
  
  const currentTheme = watch('theme');
  const currentLayout = watch('taskViewLayout');
  
  const onSubmit = async (data: PreferencesFormValues) => {
    await updatePreferences.mutateAsync(data);
  };
  
  // Auto-save when values change
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        handleSubmit(onSubmit)();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentTheme, currentLayout, isDirty, handleSubmit, onSubmit]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        onRetry={() => refetch()} 
        title="Failed to load preferences"
      />
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup
            value={currentTheme}
            onValueChange={(value) => setValue('theme', value as 'light' | 'dark', { shouldDirty: true })}
            className="grid grid-cols-2 gap-4"
          >
            <Card className={`cursor-pointer ${currentTheme === 'light' ? 'border-primary' : ''}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Sun className="h-10 w-10 mb-4" />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="font-normal">Light</Label>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${currentTheme === 'dark' ? 'border-primary' : ''}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Moon className="h-10 w-10 mb-4" />
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="font-normal">Dark</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Task View Layout</Label>
          <RadioGroup
            value={currentLayout}
            onValueChange={(value) => setValue('taskViewLayout', value as 'list' | 'board', { shouldDirty: true })}
            className="grid grid-cols-2 gap-4"
          >
            <Card className={`cursor-pointer ${currentLayout === 'list' ? 'border-primary' : ''}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="h-10 w-10 mb-4 flex flex-col justify-center items-center">
                  <div className="w-8 h-1.5 bg-primary/60 mb-1.5 rounded-sm"></div>
                  <div className="w-8 h-1.5 bg-primary/60 mb-1.5 rounded-sm"></div>
                  <div className="w-8 h-1.5 bg-primary/60 rounded-sm"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="list" id="layout-list" />
                  <Label htmlFor="layout-list" className="font-normal">List</Label>
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${currentLayout === 'board' ? 'border-primary' : ''}`}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="h-10 w-10 mb-4 flex justify-center items-center">
                  <div className="w-2.5 h-8 bg-primary/60 mx-0.5 rounded-sm"></div>
                  <div className="w-2.5 h-8 bg-primary/60 mx-0.5 rounded-sm"></div>
                  <div className="w-2.5 h-8 bg-primary/60 mx-0.5 rounded-sm"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="board" id="layout-board" />
                  <Label htmlFor="layout-board" className="font-normal">Board</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={!isDirty || updatePreferences.isPending}
      >
        {updatePreferences.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Preferences'
        )}
      </Button>
    </form>
  );
}

