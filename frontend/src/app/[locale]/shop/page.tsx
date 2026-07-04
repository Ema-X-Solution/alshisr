import { Suspense } from 'react';
import ShopPageContent from './ShopContent';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="section-padding mx-auto max-w-7xl">Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
