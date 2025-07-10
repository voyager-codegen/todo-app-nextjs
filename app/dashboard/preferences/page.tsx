'use client';

import { Card } from '@/components/ui/card';
import { PreferencesForm } from '@/components/preferences/preferences-form';
import { ImportExportSection } from '@/components/import-export/import-export-section';

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Preferences</h2>
          <PreferencesForm />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Import & Export</h2>
          <ImportExportSection />
        </Card>
      </div>
    </div>
  );
}

