'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { captureUtmsFromUrl } from '@/lib/utmTracking';

function UtmCaptureInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureUtmsFromUrl();
  }, [pathname, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function UtmCapture() {
  return (
    <Suspense fallback={null}>
      <UtmCaptureInner />
    </Suspense>
  );
}
