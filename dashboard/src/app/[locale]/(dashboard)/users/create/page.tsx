'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { UserForm } from '@/components/forms/UserForm';
import { usersApi } from '@/lib/services';

export default function CreateUserPage() {
  const t = useTranslations('users');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: tNav('dashboard'), href: '/' }, { label: t('title'), href: '/users' }, { label: tCommon('create') }]} />
      <h2 className="text-2xl font-bold">{t('createTitle')}</h2>
      <UserForm onSubmit={(data) => usersApi.create(data)} />
    </div>
  );
}
