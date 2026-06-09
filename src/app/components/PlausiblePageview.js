'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PlausiblePageview() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.plausible === 'function') {
      window.plausible('pageview');
    }
  }, [pathname]);

  return null;
}
