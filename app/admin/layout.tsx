'use client';

import { AdminAuthProvider } from '@/lib/contexts/AdminAuthContext';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const isAuthPage = isLoginPage || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password';

  return (
    <AdminAuthProvider>
      <AdminGuard>
        <div className="min-h-screen bg-[#faf8f5] dark:bg-gray-900 dark:text-gray-100 transition-colors">
          {!isAuthPage && <AdminHeader />}
          {children}
        </div>
      </AdminGuard>
    </AdminAuthProvider>
  );
}
