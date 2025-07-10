'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TaskQueryParams } from '@/types/api';
import { Search, X } from 'lucide-react';

interface TaskFilterProps {
  currentFilters: TaskQueryParams;
  onFilterChange: (filters: TaskQueryParams) => void;
}

export function TaskFilter({ currentFilters, onFilterChange }: TaskFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [filters, setFilters] = useState<TaskQueryParams>({
    status: currentFilters.status,
    sortBy: currentFilters.sortBy,
    search: currentFilters.search,
  });

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.set('status', filters.status);
    }
    
    if (filters.sortBy) {
      params.set('sortBy', filters.sortBy);
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    const queryString = params.toString();
    const url = pathname + (queryString ? `?${queryString}` : '');
    
    router.push(url);
  }, [filters, pathname, router]);

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      status: value as TaskQueryParams['status'],
    }));
  };

  const handleSortByChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value as TaskQueryParams['sortBy'],
    }));
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      search: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Status</Label>
          <RadioGroup
            value={filters.status || ''}
            onValueChange={handleStatusChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="status-all" />
              <Label htmlFor="status-all" className="font-normal">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="status-pending" />
              <Label htmlFor="status-pending" className="font-normal">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="status-completed" />
              <Label htmlFor="status-completed" className="font-normal">Completed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="overdue" id="status-overdue" />
              <Label htmlFor="status-overdue" className="font-normal">Overdue</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Sort By</Label>
          <RadioGroup
            value={filters.sortBy || ''}
            onValueChange={handleSortByChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="sort-default" />
              <Label htmlFor="sort-default" className="font-normal">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dueDate" id="sort-dueDate" />
              <Label htmlFor="sort-dueDate" className="font-normal">Due Date</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="priority" id="sort-priority" />
              <Label htmlFor="sort-priority" className="font-normal">Priority</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="createdAt" id="sort-createdAt" />
              <Label htmlFor="sort-createdAt" className="font-normal">Created Date</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="flex items-center"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}

