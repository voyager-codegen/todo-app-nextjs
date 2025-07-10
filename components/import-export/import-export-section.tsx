'use client';

import { useState } from 'react';
import { useExportTasks, useImportTasks } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Loader2, Upload } from 'lucide-react';
import { TaskImport } from '@/types/api';

export function ImportExportSection() {
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  
  const exportTasks = useExportTasks();
  const importTasks = useImportTasks();
  
  const handleExport = async () => {
    try {
      const data = await exportTasks.mutateAsync();
      
      // Create a JSON string with proper formatting
      const jsonString = JSON.stringify(data, null, 2);
      
      // Create a blob and download it
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };
  
  const handleImport = async () => {
    try {
      setImportError(null);
      
      // Validate JSON
      let parsedData: TaskImport;
      try {
        parsedData = JSON.parse(importData);
      } catch (error) {
        setImportError('Invalid JSON format. Please check your data.');
        return;
      }
      
      // Validate structure
      if (!parsedData.tasks || !Array.isArray(parsedData.tasks)) {
        setImportError('Invalid data structure. The JSON should have a "tasks" array.');
        return;
      }
      
      await importTasks.mutateAsync(parsedData);
      setImportData('');
    } catch (error) {
      // Error handling is done in the mutation
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Export Tasks</h3>
          <Button 
            onClick={handleExport}
            disabled={exportTasks.isPending}
          >
            {exportTasks.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Download all your tasks as a JSON file that you can import later or use in other applications.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Import Tasks</h3>
        <p className="text-sm text-muted-foreground">
          Import tasks from a JSON file. The file should have the same structure as the exported file.
        </p>
        
        {importError && (
          <Alert variant="destructive">
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="import-data">Paste JSON data</Label>
          <Textarea
            id="import-data"
            placeholder='{"tasks": [...]}'
            className="min-h-[200px] font-mono text-sm"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            disabled={importTasks.isPending}
          />
        </div>
        
        <Button 
          onClick={handleImport}
          disabled={!importData || importTasks.isPending}
        >
          {importTasks.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

