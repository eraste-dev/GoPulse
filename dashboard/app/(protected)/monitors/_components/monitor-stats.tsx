'use client';

import { Fragment } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MonitorStatsProps {
  total: number;
  active: number;
  down: number;
  avgResponseTime: number;
}

export const MonitorStats = ({ total, active, down, avgResponseTime }: MonitorStatsProps) => {
  const { t } = useTranslation();

  const items = [
    {
      icon: Monitor,
      info: total.toString(),
      desc: t('monitors.stats.total'),
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: CheckCircle,
      info: active.toString(),
      desc: t('monitors.stats.active'),
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: AlertTriangle,
      info: down.toString(),
      desc: t('monitors.stats.down'),
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: Activity,
      info: `${avgResponseTime}ms`,
      desc: t('monitors.stats.avg_response'),
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold tracking-tight">{item.info}</span>
                <span className="text-sm font-medium text-muted-foreground">{item.desc}</span>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
