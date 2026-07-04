'use client';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { UserForm } from '@/components/forms/UserForm';
import { usersApi } from '@/lib/services';

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'Users', href: '/users' }, { label: 'Create' }]} />
      <h2 className="text-2xl font-bold">Create User</h2>
      <UserForm onSubmit={(data) => usersApi.create(data)} />
    </div>
  );
}
