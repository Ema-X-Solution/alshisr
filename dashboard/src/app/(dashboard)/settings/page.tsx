'use client';

import { useState, useEffect } from 'react';
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

const SETTING_GROUPS = [
  { key: 'general', label: 'General' },
  { key: 'colors', label: 'Colors' },
  { key: 'contact', label: 'Contact' },
  { key: 'social', label: 'Social' },
  { key: 'payments', label: 'Payments' },
  { key: 'shipping', label: 'Shipping' },
];

export default function SettingsPage() {
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
      toast({ title: 'Settings saved successfully' });
    },
    onError: () => toast({ title: 'Failed to save settings', variant: 'destructive' }),
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
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Settings' }]} />
      <h2 className="text-2xl font-bold">Settings</h2>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {SETTING_GROUPS.map((g) => (
            <TabsTrigger key={g.key} value={g.key}>{g.label}</TabsTrigger>
          ))}
        </TabsList>

        {SETTING_GROUPS.map((g) => (
          <TabsContent key={g.key} value={g.key}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{g.label} Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formValues[g.key] && Object.entries(formValues[g.key]).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`${g.key}-${key}`}>{key.replace(/_/g, ' ')}</Label>
                    <Input
                      id={`${g.key}-${key}`}
                      value={value}
                      onChange={(e) => handleChange(g.key, key, e.target.value)}
                    />
                  </div>
                ))}
                {(!formValues[g.key] || Object.keys(formValues[g.key]).length === 0) && (
                  <p className="text-sm text-muted-foreground">No settings in this group yet. Save values to create them.</p>
                )}
                <Button onClick={() => handleSave(g.key)} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? <LoadingSpinner size="sm" /> : `Save ${g.label}`}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
