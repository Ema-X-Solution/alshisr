import { Suspense } from 'react';
import LoginForm from './LoginForm';
import { LoadingSpinner } from '@/components/ui/loading';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner size="lg" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
