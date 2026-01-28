'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DashboardStats,
  UptimeChart,
  useDashboardData,
} from './dashboard';

export function MonitorsDashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'24h' | '7d'>('24h');

  const { stats, history, isLoading, refetch } = useDashboardData({
    period,
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-6">
      {/* Period selector and refresh */}
      <div className="flex items-center justify-between">
        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as '24h' | '7d')}
        >
          <TabsList>
            <TabsTrigger value="24h">{t('dashboard.period.24h')}</TabsTrigger>
            <TabsTrigger value="7d">{t('dashboard.period.7d')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          {t('dashboard.refresh')}
        </Button>
      </div>

      {/* KPI Stats */}
      <DashboardStats data={stats} isLoading={isLoading} />

      {/* Charts */}
      <UptimeChart data={history} period={period} isLoading={isLoading} />
    </div>
  );
}
