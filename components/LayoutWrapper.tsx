'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPortalPage = pathname?.startsWith('/portal') || pathname?.startsWith('/q/');

  if (isPortalPage) {
    return <>{children}</>;
  }

  return <main className="pt-20">{children}</main>;
}
