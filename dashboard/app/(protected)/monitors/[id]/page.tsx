'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, BookOpen, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/common/confirm-modal';
import { PromoBlock } from '@/components/common/promo-block';
import { EditMonitorModal } from '../_components/edit-monitor-modal';
import {
  MonitorDetailCard,
  MonitorDetailCharts,
  useMonitorDetail,
} from './_components';

export default function MonitorDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    monitor,
    history,
    isLoading,
    isHistoryLoading,
    isError,
    toggleActive,
    isToggling,
    deleteMonitor,
    isDeleting,
    refetch,
  } = useMonitorDetail({ id, period });

  const handleToggleActive = () => {
    if (monitor) {
      toggleActive(!monitor.isActive);
      toast.success(t('common.messages.success'));
    }
  };

  const handleDelete = () => {
    deleteMonitor();
    toast.success(t('common.messages.success'));
    router.push('/monitors?tab=list');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            {t('common.messages.loading')}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !monitor) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">{t('monitors.detail.not_found')}</p>
          <Button asChild variant="outline">
            <Link href="/monitors?tab=list">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('monitors.detail.back_to_list')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/monitors?tab=list">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('monitors.detail.back_to_list')}
          </Link>
        </Button>
      </div>

      {/* Main Content - 1/3 + 2/3 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 1/3 */}
        <div className="lg:col-span-1 space-y-6">
          <MonitorDetailCard
            monitor={monitor}
            onToggleActive={handleToggleActive}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteConfirm(true)}
            isToggling={isToggling}
          />

          {/* Promo Block */}
          <PromoBlock
            title={t('monitors.detail.promo.title')}
            description={t('monitors.detail.promo.description')}
            icon={Lightbulb}
            ctaText={t('monitors.detail.promo.cta')}
            ctaHref="/docs/monitors"
            variant="gradient"
          />

          {/* Tutorial Block */}
          <PromoBlock
            title={t('monitors.detail.tutorial.title')}
            description={t('monitors.detail.tutorial.description')}
            icon={BookOpen}
            ctaText={t('monitors.detail.tutorial.cta')}
            ctaHref="/tutorials"
            variant="outline"
            size="sm"
          />
        </div>

        {/* Right Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <MonitorDetailCharts
            data={history}
            period={period}
            onPeriodChange={setPeriod}
            onRefresh={refetch}
            isLoading={isHistoryLoading}
            monitorName={monitor.name}
          />

          {/* Feature Highlight */}
          <PromoBlock
            title={t('monitors.detail.feature.title')}
            description={t('monitors.detail.feature.description')}
            icon={Zap}
            ctaText={t('monitors.detail.feature.cta')}
            onCtaClick={() => toast.info(t('common.messages.coming_soon'))}
            variant="default"
            size="sm"
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('monitors.confirm_delete.title')}
        description={t('monitors.confirm_delete.description')}
        confirmText={t('common.buttons.delete')}
        cancelText={t('common.buttons.cancel')}
        variant="destructive"
        disabled={isDeleting}
      />

      {/* Edit Monitor Modal */}
      <EditMonitorModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSuccess={refetch}
        monitor={monitor}
      />
    </div>
  );
}
