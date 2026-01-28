'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export interface UptimeDataPoint {
  timestamp: string;
  uptime: number;
  avgResponseTime: number;
  totalChecks: number;
}

export interface UptimeChartProps {
  data: UptimeDataPoint[];
  period: '24h' | '7d';
  isLoading?: boolean;
}

const chartConfig = {
  uptime: {
    label: 'Uptime',
    color: 'hsl(var(--chart-1))',
  },
  avgResponseTime: {
    label: 'Response Time',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function UptimeChart({ data, period, isLoading }: UptimeChartProps) {
  const { t } = useTranslation();

  const formattedData = useMemo(() => {
    return data.map((point) => {
      const date = new Date(point.timestamp);
      return {
        ...point,
        time:
          period === '24h'
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
      };
    });
  }, [data, period]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.charts.uptime_title')}</CardTitle>
          <CardDescription>{t('dashboard.charts.uptime_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              {t('common.messages.loading')}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.charts.uptime_title')}</CardTitle>
        <CardDescription>
          {period === '24h'
            ? t('dashboard.charts.last_24h')
            : t('dashboard.charts.last_7d')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="fillUptime" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-uptime)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-uptime)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                yAxisId="uptime"
                domain={[90, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}%`}
                className="text-xs"
              />
              <YAxis
                yAxisId="response"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}ms`}
                className="text-xs"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'uptime') return [`${value}%`, 'Uptime'];
                      return [`${value}ms`, 'Response Time'];
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                yAxisId="uptime"
                type="monotone"
                dataKey="uptime"
                stroke="var(--color-uptime)"
                fill="url(#fillUptime)"
                strokeWidth={2}
              />
              <Line
                yAxisId="response"
                type="monotone"
                dataKey="avgResponseTime"
                stroke="var(--color-avgResponseTime)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
