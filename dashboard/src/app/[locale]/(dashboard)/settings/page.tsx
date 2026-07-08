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

const SETTING_GROUP_KEYS = ['general', 'colors', 'contact', 'social', 'payments', 'shipping'] as const;

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

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title') }]} />
      <h2 className="text-2xl font-bold">{t('title')}</h2>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap h-auto gap-1">
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
                {formValues[key] && Object.entries(formValues[key]).map(([fieldKey, value]) => (
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
                  <p className="text-sm text-muted-foreground">No settings in this group yet. Save values to create them.</p>
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
