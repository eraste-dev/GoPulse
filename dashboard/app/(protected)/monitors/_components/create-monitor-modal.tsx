'use client';

import { useState } from 'react';
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
import { Check, Loader2, Globe, Activity, ShieldCheck } from 'lucide-react';
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

interface CreateMonitorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateMonitorModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateMonitorModalProps) {
  const { t } = useTranslation();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    up: boolean;
    message: string;
    latency: number;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      interval: 60,
      timeout: 10,
      threshold: 3,
      method: 'GET',
      regions: ['europe'],
    },
  });

  async function onTestConnectivity() {
    const url = form.getValues('url');
    if (!url) {
      form.setError('url', { message: 'URL is required for testing' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    try {
      const testRes = await apiFetch('/api/monitors/test-connectivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await testRes.json();
      setTestResult(data);
      if (data.up) {
        toast.success(data.message || 'Connectivity test passed!');
      } else {
        toast.error('Connectivity test failed: ' + data.message);
      }
    } catch (error) {
      toast.error('Failed to test connectivity');
    } finally {
      setIsTesting(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await apiFetch('/api/monitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to create monitor');
      }

      toast.success(t('monitors.create.success'));
      form.reset();
      setTestResult(null);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle>{t('monitors.create.title')}</DialogTitle>
          <DialogDescription>
            {t('monitors.create.description')}
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
                                                defaultValue={field.value}
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

                            <div className="flex gap-2 items-end">
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>{t('monitors.create.url')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onTestConnectivity}
                                    disabled={isTesting || !form.getValues('url')}
                                >
                                    {isTesting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        t('monitors.create.test_connectivity')
                                    )}
                                </Button>
                            </div>
                            {testResult && (
                                <div
                                    className={`p-3 rounded-md text-sm flex items-center gap-2 ${
                                        testResult.up
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                    }`}
                                >
                                    {testResult.up ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Activity className="h-4 w-4" />
                                    )}
                                    {testResult.message}{' '}
                                    {testResult.latency > 0 && `(${testResult.latency}ms)`}
                                </div>
                            )}
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
                                                defaultValue={[field.value]}
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
                                            defaultValue={field.value[0]}
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
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && (
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
