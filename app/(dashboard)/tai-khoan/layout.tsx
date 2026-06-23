import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { FloatingContacts } from '@/components/layout/FloatingContacts';
import { SiteSettingsProvider } from '@/components/layout/SiteSettingsProvider';
import { DashboardSidebar } from '@/components/dashboard';
import { AuthModal, AuthRequired } from '@/components/auth';
import { getSiteSettings } from '@/lib/server-data';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { branding, contact } = await getSiteSettings();
  const publicSettings = {
    siteName: contact.site_name,
    tagline: branding.tagline,
    logo: branding.logo,
    hotline: contact.hotline,
    zaloPhone: contact.zalo_phone,
    email: contact.email,
  };

  return (
    <SiteSettingsProvider value={publicSettings}>
      <Header logoUrl={branding.logo || undefined} siteName={contact.site_name} />
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
    </SiteSettingsProvider>
  );
}
