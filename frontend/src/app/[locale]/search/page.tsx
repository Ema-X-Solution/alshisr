import { Suspense } from 'react';
import SearchPageContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="section-padding mx-auto max-w-7xl">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
