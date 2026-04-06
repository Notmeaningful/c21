'use client';

import { DarkModeProvider } from '@/lib/contexts/DarkModeContext';
import { ReactNode } from 'react';

export function RootDarkModeProvider({ children }: { children: ReactNode }) {
  return <DarkModeProvider>{children}</DarkModeProvider>;
}
