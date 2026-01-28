'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Monitor } from './monitor-detail-card';
import type { HistoryDataPoint } from './monitor-detail-charts';

export interface UseMonitorDetailOptions {
  id: string;
  period?: '24h' | '7d' | '30d';
}

export function useMonitorDetail({ id, period = '24h' }: UseMonitorDetailOptions) {
  const queryClient = useQueryClient();

  const monitorQuery = useQuery<Monitor>({
    queryKey: ['monitor', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/monitors/${id}`);
      if (!res.ok) throw new Error('Failed to fetch monitor');
      return res.json();
    },
  });

  const historyQuery = useQuery<HistoryDataPoint[]>({
    queryKey: ['monitor', id, 'history', period],
    queryFn: async () => {
      const res = await apiFetch(`/api/monitors/${id}/history?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      const res = await apiFetch(`/api/monitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Failed to update monitor');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitor', id] });
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/monitors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete monitor');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
  });

  return {
    monitor: monitorQuery.data,
    history: historyQuery.data ?? [],
    isLoading: monitorQuery.isLoading,
    isHistoryLoading: historyQuery.isLoading,
    isError: monitorQuery.isError,
    error: monitorQuery.error,
    toggleActive: (isActive: boolean) => toggleActiveMutation.mutate(isActive),
    isToggling: toggleActiveMutation.isPending,
    deleteMonitor: () => deleteMutation.mutate(),
    isDeleting: deleteMutation.isPending,
    refetch: () => {
      monitorQuery.refetch();
      historyQuery.refetch();
    },
  };
}
