'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyEmailContent() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="section-padding flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="font-display text-2xl">{t('verifyEmail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && <p>{t('verifyEmail')}...</p>}
          {status === 'success' && (
            <>
              <p className="mb-6 text-green-700">{t('verifySuccess')}</p>
              <Button asChild><Link href="/login">{t('login')}</Link></Button>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="mb-6 text-destructive">{t('verifyError')}</p>
              <Button asChild variant="outline"><Link href="/">{t('login')}</Link></Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
