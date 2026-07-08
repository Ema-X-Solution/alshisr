'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
}

export function FormActions({ children }: FormActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 border-t bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:-mx-6 lg:px-6">
      <div className="flex items-center justify-end gap-3">{children}</div>
    </div>
  );
}
