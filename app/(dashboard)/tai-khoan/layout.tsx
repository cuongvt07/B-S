import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { DashboardSidebar } from '@/components/dashboard';
import { AuthModal } from '@/components/auth';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-app grid grid-cols-1 gap-6 py-6 lg:grid-cols-[240px_1fr]">
          <DashboardSidebar />
          <div>{children}</div>
        </div>
      </main>
      <AuthModal />
    </>
  );
}
