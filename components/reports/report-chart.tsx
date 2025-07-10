'use client';

import { useTheme } from 'next-themes';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TaskReport, ReportQueryParams } from '@/types/api';

interface ReportChartProps {
  report: TaskReport;
  period: ReportQueryParams['period'];
}

export function ReportChart({ report, period }: ReportChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // This would normally come from the API, but we'll mock it for now
  const data = [
    {
      name: period === 'weekly' ? 'Mon' : 'Week 1',
      completed: 5,
      overdue: 2,
    },
    {
      name: period === 'weekly' ? 'Tue' : 'Week 2',
      completed: 7,
      overdue: 1,
    },
    {
      name: period === 'weekly' ? 'Wed' : 'Week 3',
      completed: 4,
      overdue: 3,
    },
    {
      name: period === 'weekly' ? 'Thu' : 'Week 4',
      completed: 6,
      overdue: 0,
    },
    {
      name: period === 'weekly' ? 'Fri' : 'Week 5',
      completed: 8,
      overdue: 1,
    },
    {
      name: period === 'weekly' ? 'Sat' : '',
      completed: 3,
      overdue: 0,
    },
    {
      name: period === 'weekly' ? 'Sun' : '',
      completed: 2,
      overdue: 0,
    },
  ];
  
  // Filter out empty weeks for monthly view
  const chartData = period === 'monthly' 
    ? data.filter(item => item.name !== '') 
    : data;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: isDark ? '#ccc' : '#333' }}
        />
        <YAxis 
          tick={{ fill: isDark ? '#ccc' : '#333' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? '#333' : '#fff',
            color: isDark ? '#fff' : '#333',
            border: `1px solid ${isDark ? '#444' : '#ddd'}`,
          }}
        />
        <Legend />
        <Bar 
          dataKey="completed" 
          name="Completed Tasks" 
          fill="hsl(var(--chart-1))" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="overdue" 
          name="Overdue Tasks" 
          fill="hsl(var(--chart-2))" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

