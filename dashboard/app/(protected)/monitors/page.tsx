'use client';

import { useState } from 'react';
import { Plus, LayoutDashboard, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateMonitorModal } from './_components/create-monitor-modal';
import { MonitorsList } from './_components/monitors-list';
import { MonitorsDashboard } from './_components/monitors-dashboard';

export default function MonitorsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('monitors.title')}
          </h1>
          <p className="text-muted-foreground">{t('monitors.subtitle')}</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('monitors.add_monitor')}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'dashboard' | 'list')}>
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {t('monitors.tabs.dashboard')}
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {t('monitors.tabs.list')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <MonitorsDashboard />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <MonitorsList />
        </TabsContent>
      </Tabs>

      {/* Create Monitor Modal */}
      <CreateMonitorModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['monitors'] })}
      />
    </div>
  );
}
