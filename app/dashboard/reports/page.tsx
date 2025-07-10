'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskReport } from '@/components/reports/task-report';
import { ReportQueryParams } from '@/types/api';

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportQueryParams['period']>('weekly');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View reports and analytics for your tasks
        </p>
      </div>

      <Tabs defaultValue="weekly" onValueChange={(value) => setPeriod(value as ReportQueryParams['period'])}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Weekly Task Report</CardTitle>
                <CardDescription>
                  Your task performance for the current week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskReport period="weekly" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="monthly">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Monthly Task Report</CardTitle>
                <CardDescription>
                  Your task performance for the current month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskReport period="monthly" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

