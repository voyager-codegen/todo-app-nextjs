'use client';

import { useGetTaskReport } from '@/lib/queries';
import { ReportQueryParams } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ReportChart } from '@/components/reports/report-chart';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TaskReportProps {
  period: ReportQueryParams['period'];
}

export function TaskReport({ period }: TaskReportProps) {
  const { 
    data: report, 
    isLoading, 
    error, 
    refetch 
  } = useGetTaskReport({ period });
  
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
        title="Failed to load report"
      />
    );
  }
  
  if (!report) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">No report data available</p>
      </div>
    );
  }
  
  const progressPercentage = Math.round(report.taskProgress * 100);
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{report.completedTasks}</div>
              <p className="text-xs text-muted-foreground">Completed Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{report.overdueTasks}</div>
              <p className="text-xs text-muted-foreground">Overdue Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{progressPercentage}%</div>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Task Progress</span>
              <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 h-[300px]">
          <ReportChart report={report} period={period} />
        </CardContent>
      </Card>
    </div>
  );
}

