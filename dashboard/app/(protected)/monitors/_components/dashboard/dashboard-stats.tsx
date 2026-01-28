'use client';

import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KpiCard } from './kpi-card';

export interface DashboardStatsData {
  totalMonitors: number;
  activeMonitors: number;
  downMonitors: number;
  uptimePercentage: number;
  avgResponseTime: number;
}

export interface DashboardStatsProps {
  data: DashboardStatsData | undefined;
  isLoading?: boolean;
}

export function DashboardStats({ data, isLoading }: DashboardStatsProps) {
  const { t } = useTranslation();

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-card rounded-lg border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title={t('dashboard.stats.uptime')}
        value={data.uptimePercentage}
        suffix="%"
        icon={CheckCircle}
        colorScheme="green"
        formatValue={(v) => v.toFixed(2)}
      />
      <KpiCard
        title={t('dashboard.stats.monitors_down')}
        value={data.downMonitors}
        icon={AlertTriangle}
        colorScheme={data.downMonitors > 0 ? 'red' : 'green'}
      />
      <KpiCard
        title={t('dashboard.stats.avg_response')}
        value={data.avgResponseTime}
        suffix="ms"
        icon={Clock}
        colorScheme="blue"
      />
      <KpiCard
        title={t('dashboard.stats.total_monitors')}
        value={data.totalMonitors}
        icon={Activity}
        colorScheme="purple"
      />
    </div>
  );
}
