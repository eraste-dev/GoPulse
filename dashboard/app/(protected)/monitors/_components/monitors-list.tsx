'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Play, Pause, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { useState } from 'react';

export function MonitorsList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: monitors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['monitors'],
    queryFn: async () => {
      const res = await apiFetch('/api/monitors');
      if (!res.ok) throw new Error('Failed to fetch monitors');
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/monitors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete monitor');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
      toast.success(t('common.messages.success'));
      setDeleteId(null);
    },
    onError: () => {
      toast.error(t('common.messages.error'));
      setDeleteId(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiFetch(`/api/monitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error('Failed to update monitor');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
      toast.success(t('common.messages.success'));
    },
    onError: () => {
      toast.error(t('common.messages.error'));
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    toggleActiveMutation.mutate({ id, isActive: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">{t('common.messages.loading')}</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {t('common.messages.error')}
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('monitors.list.title')}</CardTitle>
          <CardDescription>{t('monitors.list.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('monitors.table.url_name')}</TableHead>
                <TableHead>{t('monitors.table.status')}</TableHead>
                <TableHead>{t('monitors.table.last_code')}</TableHead>
                <TableHead>{t('monitors.table.response_time')}</TableHead>
                <TableHead>{t('monitors.table.last_check')}</TableHead>
                <TableHead className="text-right">
                  {t('monitors.table.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitors?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t('monitors.table.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                monitors?.map((monitor: any) => (
                  <TableRow key={monitor.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{monitor.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {monitor.url}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {monitor.isActive === false ? (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          {t('monitors.status.paused')}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {t('monitors.status.up')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">200 OK</Badge>
                    </TableCell>
                    <TableCell>120ms</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(monitor.updatedAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            {t('monitors.table.actions')}
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              navigator.clipboard.writeText(monitor.url)
                            }
                          >
                            {t('monitors.actions.copy_url')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link href={`/monitors/${monitor.id}`}>
                              {t('monitors.actions.view_details')}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              handleToggleActive(monitor.id, monitor.isActive)
                            }
                          >
                            {monitor.isActive ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />{' '}
                                {t('monitors.status.pause')}
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />{' '}
                                {t('monitors.status.resume')}
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(monitor.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                            {t('common.buttons.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('monitors.confirm_delete.title')}
        description={t('monitors.confirm_delete.description')}
        confirmText={t('common.buttons.delete')}
        cancelText={t('common.buttons.cancel')}
        variant="destructive"
        disabled={deleteMutation.isPending}
      />
    </>
  );
}
