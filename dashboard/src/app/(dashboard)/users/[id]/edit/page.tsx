'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { UserForm } from '@/components/forms/UserForm';
import { PageLoader } from '@/components/ui/loading';
import { usersApi } from '@/lib/services';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, isLoading } = useQuery({ queryKey: ['user', id], queryFn: () => usersApi.get(id) });
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Users', href: '/users' }, { label: 'Edit' }]} />
      <h2 className="text-2xl font-bold">Edit User</h2>
      {user && <UserForm user={user} onSubmit={(data) => usersApi.update(id, data)} />}
    </div>
  );
}
