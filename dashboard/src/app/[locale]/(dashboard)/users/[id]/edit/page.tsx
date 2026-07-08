'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { UserForm } from '@/components/forms/UserForm';
import { PageLoader } from '@/components/ui/loading';
import { usersApi } from '@/lib/services';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('users');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { id } = use(params);
  const { data: user, isLoading } = useQuery({ queryKey: ['user', id], queryFn: () => usersApi.get(id) });
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/users' }, { label: tCommon('edit') }]} />
      <h2 className="text-2xl font-bold">{t('editTitle')}</h2>
      {user && <UserForm user={user} onSubmit={(data) => usersApi.update(id, data)} />}
    </div>
  );
}
