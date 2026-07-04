import { Suspense } from 'react';
import ResetPasswordContent from './ResetPasswordContent';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="section-padding text-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
