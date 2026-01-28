'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { DashboardStatsData } from './dashboard-stats';
import type { UptimeDataPoint } from './uptime-chart';

export interface UseDashboardDataOptions {
  period?: '24h' | '7d';
  refetchInterval?: number;
}

export function useDashboardStats(options?: { refetchInterval?: number }) {
  return useQuery<DashboardStatsData>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await apiFetch('/api/monitors/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return res.json();
    },
    refetchInterval: options?.refetchInterval ?? 30000, // 30s by default
  });
}

export function useDashboardHistory(options?: UseDashboardDataOptions) {
  const period = options?.period ?? '24h';

  return useQuery<UptimeDataPoint[]>({
    queryKey: ['dashboard', 'history', period],
    queryFn: async () => {
      const res = await apiFetch(`/api/monitors/dashboard/history?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch uptime history');
      return res.json();
    },
    refetchInterval: options?.refetchInterval ?? 60000, // 1min by default
  });
}

export function useDashboardData(options?: UseDashboardDataOptions) {
  const stats = useDashboardStats({ refetchInterval: options?.refetchInterval });
  const history = useDashboardHistory(options);

  return {
    stats: stats.data,
    history: history.data ?? [],
    isLoading: stats.isLoading || history.isLoading,
    isError: stats.isError || history.isError,
    error: stats.error || history.error,
    refetch: () => {
      stats.refetch();
      history.refetch();
    },
  };
}
