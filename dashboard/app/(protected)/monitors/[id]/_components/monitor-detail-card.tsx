'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Clock,
  AlertTriangle,
  Pause,
  Play,
  Settings,
  Trash2,
  ExternalLink,
  MapPin,
  Timer,
  Activity,
  MoreVertical,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    UP: { label: t('monitors.status.up') },
    DOWN: { label: t('monitors.status.down') },
    PAUSED: { label: t('monitors.status.paused') },
  };

  const currentStatus = !monitor.isActive
    ? 'PAUSED'
    : monitor.lastStatus || 'UP';
  const status = statusConfig[currentStatus];

  const details = [
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

  const statusDotColor = {
    UP: 'bg-green-500',
    DOWN: 'bg-red-500',
    PAUSED: 'bg-yellow-500',
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        {/* Top row: Status + Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {currentStatus === 'UP' && (
                <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', statusDotColor[currentStatus])} />
              )}
              <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', statusDotColor[currentStatus])} />
            </span>
            <span className={cn(
              'text-sm font-medium',
              currentStatus === 'UP' && 'text-green-600 dark:text-green-400',
              currentStatus === 'DOWN' && 'text-red-600 dark:text-red-400',
              currentStatus === 'PAUSED' && 'text-yellow-600 dark:text-yellow-400'
            )}>
              {status.label}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleActive} disabled={isToggling}>
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
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Settings className="h-4 w-4 mr-2" />
                {t('monitors.detail.edit_settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.buttons.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <CardTitle className="text-xl font-semibold truncate">{monitor.name}</CardTitle>

        {/* URL with method badge */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-mono shrink-0">
            {monitor.method}
          </Badge>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground truncate hover:text-foreground hover:underline transition-colors flex items-center gap-1 group"
          >
            <span className="truncate">{monitor.url.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
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

      </CardContent>
    </Card>
  );
}
