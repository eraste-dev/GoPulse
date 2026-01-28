'use client';

import { useMemo, useRef, useCallback } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
} from 'recharts';
import { RefreshCw, Download, FileDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export interface HistoryDataPoint {
  timestamp: string;
  responseTime: number;
  status: 'UP' | 'DOWN';
  statusCode: number;
}

export interface MonitorDetailChartsProps {
  data: HistoryDataPoint[];
  period: '24h' | '7d' | '30d';
  onPeriodChange: (period: '24h' | '7d' | '30d') => void;
  onRefresh: () => void;
  onExport?: (format: 'csv' | 'json') => void;
  isLoading?: boolean;
  monitorName?: string;
}

const responseTimeConfig = {
  responseTime: {
    label: 'Response Time',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const statusConfig = {
  UP: {
    label: 'Up',
    color: 'hsl(142, 76%, 36%)',
  },
  DOWN: {
    label: 'Down',
    color: 'hsl(0, 84%, 60%)',
  },
} satisfies ChartConfig;

export function MonitorDetailCharts({
  data,
  period,
  onPeriodChange,
  onRefresh,
  onExport,
  isLoading,
  monitorName = 'Monitor',
}: MonitorDetailChartsProps) {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);

  const formattedData = useMemo(() => {
    return data.map((point) => {
      const date = new Date(point.timestamp);
      let timeLabel: string;

      if (period === '24h') {
        timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (period === '7d') {
        timeLabel = date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
      } else {
        timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }

      return {
        ...point,
        time: timeLabel,
        fullTime: date.toLocaleString(),
        fill: point.status === 'UP' ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)',
      };
    });
  }, [data, period]);

  // Calculate stats
  const stats = useMemo(() => {
    if (data.length === 0) return { avgResponse: 0, maxResponse: 0, minResponse: 0, uptime: 100, totalChecks: 0 };

    const responseTimes = data.map((d) => d.responseTime);
    const upCount = data.filter((d) => d.status === 'UP').length;

    return {
      avgResponse: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
      maxResponse: Math.max(...responseTimes),
      minResponse: Math.min(...responseTimes),
      uptime: Math.round((upCount / data.length) * 10000) / 100,
      totalChecks: data.length,
    };
  }, [data]);

  // Export handlers
  const handleExportCSV = useCallback(() => {
    const headers = ['Timestamp', 'Response Time (ms)', 'Status', 'Status Code'];
    const rows = data.map((d) => [
      new Date(d.timestamp).toISOString(),
      d.responseTime,
      d.status,
      d.statusCode,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${monitorName.replace(/\s+/g, '_')}_report_${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(t('monitors.detail.export.success'));
  }, [data, period, monitorName, t]);

  const handleExportJSON = useCallback(() => {
    const exportData = {
      monitor: monitorName,
      period,
      exportedAt: new Date().toISOString(),
      stats,
      data: data.map((d) => ({
        timestamp: d.timestamp,
        responseTime: d.responseTime,
        status: d.status,
        statusCode: d.statusCode,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${monitorName.replace(/\s+/g, '_')}_report_${period}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(t('monitors.detail.export.success'));
  }, [data, period, monitorName, stats, t]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-[300px] bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-[120px] bg-muted/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Tabs value={period} onValueChange={(v) => onPeriodChange(v as '24h' | '7d' | '30d')}>
          <TabsList className="h-9">
            <TabsTrigger value="24h" className="text-xs px-3">{t('monitors.detail.period.24h')}</TabsTrigger>
            <TabsTrigger value="7d" className="text-xs px-3">{t('monitors.detail.period.7d')}</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-3">{t('monitors.detail.period.30d')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                {t('monitors.detail.export.title')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                {t('monitors.detail.export.csv')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <Download className="h-4 w-4 mr-2" />
                {t('monitors.detail.export.json')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Quick Stats - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xl font-bold text-green-600">{stats.uptime}%</p>
          <p className="text-xs text-muted-foreground">{t('monitors.detail.uptime')}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xl font-bold">{stats.avgResponse}<span className="text-sm font-normal text-muted-foreground">ms</span></p>
          <p className="text-xs text-muted-foreground">{t('monitors.detail.avg_response')}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xl font-bold text-blue-600">{stats.minResponse}<span className="text-sm font-normal text-muted-foreground">ms</span></p>
          <p className="text-xs text-muted-foreground">{t('monitors.detail.min_response')}</p>
        </div>
        <div className="bg-card border rounded-lg p-3">
          <p className="text-xl font-bold text-orange-600">{stats.maxResponse}<span className="text-sm font-normal text-muted-foreground">ms</span></p>
          <p className="text-xs text-muted-foreground">{t('monitors.detail.max_response')}</p>
        </div>
      </div>

      {/* Response Time Chart with Brush for zoom */}
      <Card ref={chartRef}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{t('monitors.detail.charts.response_time')}</CardTitle>
              <CardDescription className="text-xs">{t('monitors.detail.charts.response_time_desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <ChartContainer config={responseTimeConfig} className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillResponseTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-responseTime)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-responseTime)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                  tick={{ fontSize: 10 }}
                  width={40}
                />
                <ReferenceLine y={stats.avgResponse} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => [
                        `${value}ms`,
                        item.payload.fullTime,
                      ]}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="responseTime"
                  stroke="var(--color-responseTime)"
                  fill="url(#fillResponseTime)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('monitors.detail.charts.status_history')}</CardTitle>
          <CardDescription className="text-xs">
            {t('monitors.detail.charts.status_history_desc')} ({stats.totalChecks} {t('monitors.detail.checks')})
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer config={statusConfig} className="h-[60px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} barCategoryGap={0} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => [
                        `${item.payload.status} (${item.payload.statusCode}) - ${item.payload.responseTime}ms`,
                        item.payload.fullTime,
                      ]}
                    />
                  }
                />
                <Bar dataKey="responseTime" radius={[1, 1, 0, 0]}>
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
              <span className="text-xs text-muted-foreground">{t('monitors.status.up')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
              <span className="text-xs text-muted-foreground">{t('monitors.status.down')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
