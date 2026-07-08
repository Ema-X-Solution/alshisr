'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageLoader, LoadingSpinner } from '@/components/ui/loading';
import { settingsApi } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SETTING_GROUP_KEYS = ['general', 'colors', 'contact', 'social', 'payments', 'shipping'] as const;

const COLOR_KEY_ORDER = [
  'primary',
  'secondary',
  'background',
  'text',
  'lavender',
  'saffron',
  'olive',
  'sage',
  'brown',
] as const;

type ColorKey = (typeof COLOR_KEY_ORDER)[number];

function isHexColor(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function normalizeHex(value: string) {
  const cleaned = value.trim();
  if (!isHexColor(cleaned)) return '#000000';
  if (cleaned.length === 4) {
    return `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`;
  }
  return cleaned;
}

function sortColorEntries(entries: [string, string][]) {
  const order = new Map(COLOR_KEY_ORDER.map((key, index) => [key, index]));
  return [...entries].sort((a, b) => {
    const ai = order.get(a[0] as ColorKey) ?? 999;
    const bi = order.get(b[0] as ColorKey) ?? 999;
    return ai - bi;
  });
}

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tNav = useTranslations('nav');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getAll,
  });

  useEffect(() => {
    if (!settings) return;
    const initial: Record<string, Record<string, string>> = {};
    for (const [group, items] of Object.entries(settings)) {
      initial[group] = {};
      for (const [key, val] of Object.entries(items)) {
        initial[group][key] = String(val.value ?? '');
      }
    }
    setFormValues(initial);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({ title: t('saved') });
    },
    onError: () => toast({ title: t('saveFailed'), variant: 'destructive' }),
  });

  const handleChange = (group: string, key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [group]: { ...prev[group], [key]: value },
    }));
  };

  const handleSave = (group: string) => {
    const groupSettings = formValues[group];
    if (!groupSettings) return;
    const payload = Object.entries(groupSettings).map(([key, value]) => ({
      group,
      key,
      value,
      type: settings?.[group]?.[key]?.type || 'string',
    }));
    saveMutation.mutate(payload);
  };

  const renderColorField = (fieldKey: string, value: string) => {
    const hasLabel = COLOR_KEY_ORDER.includes(fieldKey as ColorKey);
    const label = hasLabel ? t(`colorKeys.${fieldKey}.label`) : fieldKey.replace(/_/g, ' ');
    const affects = hasLabel ? t(`colorKeys.${fieldKey}.affects`) : null;
    const pickerValue = normalizeHex(value || '#000000');

    return (
      <div key={fieldKey} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 h-12 w-12 shrink-0 rounded-md border border-border shadow-sm"
            style={{ backgroundColor: isHexColor(value) ? value : pickerValue }}
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-1">
            <Label htmlFor={`colors-${fieldKey}`} className="text-base font-semibold">
              {label}
            </Label>
            {affects && (
              <p className="text-sm leading-relaxed text-muted-foreground">{affects}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="color"
            aria-label={label}
            value={pickerValue}
            onChange={(e) => handleChange('colors', fieldKey, e.target.value.toUpperCase())}
            className={cn(
              'h-11 w-14 cursor-pointer rounded-md border border-border bg-background p-1',
            )}
          />
          <Input
            id={`colors-${fieldKey}`}
            value={value}
            onChange={(e) => handleChange('colors', fieldKey, e.target.value)}
            placeholder="#5B2C83"
            className="max-w-[11rem] font-mono uppercase"
            dir="ltr"
          />
        </div>
      </div>
    );
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <h2 className="text-2xl font-bold">{t('title')}</h2>

      <Tabs defaultValue="general">
        <TabsList className="flex h-auto flex-wrap gap-1">
          {SETTING_GROUP_KEYS.map((key) => (
            <TabsTrigger key={key} value={key}>{t(key)}</TabsTrigger>
          ))}
        </TabsList>

        {SETTING_GROUP_KEYS.map((key) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t(key)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {key === 'colors' && formValues.colors
                  ? sortColorEntries(Object.entries(formValues.colors)).map(([fieldKey, value]) =>
                      renderColorField(fieldKey, value),
                    )
                  : formValues[key] &&
                    Object.entries(formValues[key]).map(([fieldKey, value]) => (
                      <div key={fieldKey} className="space-y-2">
                        <Label htmlFor={`${key}-${fieldKey}`}>{fieldKey.replace(/_/g, ' ')}</Label>
                        <Input
                          id={`${key}-${fieldKey}`}
                          value={value}
                          onChange={(e) => handleChange(key, fieldKey, e.target.value)}
                        />
                      </div>
                    ))}
                {(!formValues[key] || Object.keys(formValues[key]).length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No settings in this group yet. Save values to create them.
                  </p>
                )}
                <Button onClick={() => handleSave(key)} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? <LoadingSpinner size="sm" /> : t('saveGroup', { group: t(key) })}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
