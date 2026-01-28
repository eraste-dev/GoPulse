'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountingNumber } from '@/components/ui/counting-number';

export interface KpiCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  formatValue?: (value: number) => string;
}

const colorSchemes = {
  blue: {
    icon: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    trend: 'text-blue-600',
  },
  green: {
    icon: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    trend: 'text-green-600',
  },
  red: {
    icon: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    trend: 'text-red-600',
  },
  orange: {
    icon: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    trend: 'text-orange-600',
  },
  purple: {
    icon: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    trend: 'text-purple-600',
  },
};

export function KpiCard({
  title,
  value,
  suffix,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  formatValue,
}: KpiCardProps) {
  const colors = colorSchemes[colorScheme];
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      <div className={cn('p-3 rounded-lg', colors.bg)}>
        <Icon className={cn('h-6 w-6', colors.icon)} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-1">
          <CountingNumber
            to={value}
            duration={1}
            className="text-2xl font-bold"
            format={(v) => (formatValue ? formatValue(v) : v.toFixed(0))}
          />
          {suffix && (
            <span className="text-sm text-muted-foreground">{suffix}</span>
          )}
        </div>
        {trend && (
          <p
            className={cn(
              'text-xs',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}% vs last period
          </p>
        )}
      </div>
    </div>
  );
}
