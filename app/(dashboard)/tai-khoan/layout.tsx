import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { FloatingContacts } from '@/components/layout/FloatingContacts';
import { DashboardSidebar } from '@/components/dashboard';
import { AuthModal, AuthRequired } from '@/components/auth';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-app grid grid-cols-1 gap-6 py-6 lg:grid-cols-[240px_1fr]">
          <DashboardSidebar />
          <div>
            <Suspense fallback={null}>
              <AuthRequired>{children}</AuthRequired>
            </Suspense>
          </div>
        </div>
      </main>
      <AuthModal />
      <FloatingContacts />
    </>
  );
}
