'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Settings,
  Trash2,
  ExternalLink,
  MapPin,
  Timer,
  Activity,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface Monitor {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  timeout: number;
  threshold: number;
  regions: string[];
  isActive: boolean;
  expectedStatus: number;
  createdAt: string;
  updatedAt: string;
  lastStatus?: 'UP' | 'DOWN';
  lastResponseTime?: number;
  lastStatusCode?: number;
}

export interface MonitorDetailCardProps {
  monitor: Monitor;
  onToggleActive?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isToggling?: boolean;
}

export function MonitorDetailCard({
  monitor,
  onToggleActive,
  onEdit,
  onDelete,
  isToggling,
}: MonitorDetailCardProps) {
  const { t } = useTranslation();

  const statusConfig = {
    UP: {
      label: t('monitors.status.up'),
      icon: CheckCircle,
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20',
    },
    DOWN: {
      label: t('monitors.status.down'),
      icon: AlertTriangle,
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20',
    },
    PAUSED: {
      label: t('monitors.status.paused'),
      icon: Pause,
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20',
    },
  };

  const currentStatus = !monitor.isActive
    ? 'PAUSED'
    : monitor.lastStatus || 'UP';
  const status = statusConfig[currentStatus];
  const StatusIcon = status.icon;

  const details = [
    {
      icon: Globe,
      label: t('monitors.detail.method'),
      value: monitor.method,
    },
    {
      icon: Timer,
      label: t('monitors.detail.interval'),
      value: `${monitor.interval}s`,
    },
    {
      icon: Clock,
      label: t('monitors.detail.timeout'),
      value: `${monitor.timeout}s`,
    },
    {
      icon: AlertTriangle,
      label: t('monitors.detail.threshold'),
      value: `${monitor.threshold} ${t('monitors.detail.failures')}`,
    },
    {
      icon: MapPin,
      label: t('monitors.detail.regions'),
      value: monitor.regions?.join(', ') || 'N/A',
    },
    {
      icon: Activity,
      label: t('monitors.detail.expected_status'),
      value: monitor.expectedStatus,
    },
  ];

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{monitor.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <a
                href={monitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:underline flex items-center gap-1"
              >
                {monitor.url}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn('shrink-0', status.className)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">
              {monitor.lastResponseTime ? `${monitor.lastResponseTime}ms` : '--'}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('monitors.detail.response_time')}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">
              {monitor.lastStatusCode || '--'}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('monitors.detail.status_code')}
            </p>
          </div>
        </div>

        <Separator />

        {/* Configuration Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t('monitors.detail.configuration')}
          </h4>
          {details.map((detail, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <detail.icon className="h-4 w-4" />
                {detail.label}
              </span>
              <span className="font-medium">{detail.value}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Timestamps */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('monitors.detail.created')}</span>
            <span>{formatDistanceToNow(new Date(monitor.createdAt), { addSuffix: true })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('monitors.detail.last_check')}</span>
            <span>{formatDistanceToNow(new Date(monitor.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onToggleActive}
            disabled={isToggling}
          >
            {monitor.isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                {t('monitors.status.pause')}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {t('monitors.status.resume')}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onEdit}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t('monitors.detail.edit_settings')}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.buttons.delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
