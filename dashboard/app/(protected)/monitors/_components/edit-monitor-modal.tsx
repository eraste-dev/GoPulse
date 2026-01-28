'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Globe, Activity, ShieldCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Friendly name must be at least 2 characters.',
  }),
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
  interval: z.coerce.number().min(30).max(3600),
  timeout: z.coerce.number().min(1).max(60),
  threshold: z.coerce.number().min(1).max(10),
  method: z.string().default('GET'),
  regions: z.array(z.string()).default(['europe']),
});

export interface MonitorData {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  timeout: number;
  threshold: number;
  regions: string[];
}

interface EditMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  monitor: MonitorData;
}

export function EditMonitorModal({
  open,
  onOpenChange,
  onSuccess,
  monitor,
}: EditMonitorModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: monitor.name,
      url: monitor.url,
      interval: monitor.interval,
      timeout: monitor.timeout,
      threshold: monitor.threshold,
      method: monitor.method,
      regions: monitor.regions || ['europe'],
    },
  });

  // Reset form when monitor changes
  useEffect(() => {
    if (open && monitor) {
      form.reset({
        name: monitor.name,
        url: monitor.url,
        interval: monitor.interval,
        timeout: monitor.timeout,
        threshold: monitor.threshold,
        method: monitor.method,
        regions: monitor.regions || ['europe'],
      });
    }
  }, [open, monitor, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/api/monitors/${monitor.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to update monitor');
      }

      toast.success(t('monitors.edit.success'));
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(t('common.messages.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle>{t('monitors.edit.title')}</DialogTitle>
          <DialogDescription>
            {t('monitors.edit.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-8">
                {/* General Info */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                    <Globe className="h-4 w-4" /> {t('monitors.create.general_info')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('monitors.create.friendly_name')}</FormLabel>
                          <FormControl>
                            <Input placeholder="My Main Website" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('monitors.create.method')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="HEAD">HEAD</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('monitors.create.url')}</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Compliance & Thresholds */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                    <Activity className="h-4 w-4" /> {t('monitors.create.compliance')}
                  </h3>
                  <FormField
                    control={form.control}
                    name="interval"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center mb-2">
                          <FormLabel>{t('monitors.create.interval')}</FormLabel>
                          <span className="text-sm text-muted-foreground">
                            {field.value}s
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={30}
                            max={300}
                            step={30}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="timeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('monitors.create.timeout')}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            {t('monitors.create.timeout_desc')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('monitors.create.threshold')}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            {t('monitors.create.threshold_desc')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                    <ShieldCheck className="h-4 w-4" /> {t('monitors.create.advanced')}
                  </h3>
                  <FormField
                    control={form.control}
                    name="regions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('monitors.create.regions')}</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange([val])}
                          value={field.value[0]}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="europe">Europe (London)</SelectItem>
                            <SelectItem value="us">North America (N. Virginia)</SelectItem>
                            <SelectItem value="asia">Asia (Singapore)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>
            <div className="p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">{t('common.buttons.cancel')}</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t('common.buttons.save')}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
