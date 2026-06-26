import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingContacts } from '@/components/layout/FloatingContacts';
import { CompareBar } from '@/components/listing';
import { AuthModal } from '@/components/auth';
import { PostModal } from '@/components/dashboard';
import { getSiteSettings } from '@/lib/server-data';
import { SiteSettingsProvider } from '@/components/layout/SiteSettingsProvider';

export default async function MarketingLayout({ children }: { children: ReactNode }) {
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
      <main className="flex-1">{children}</main>
      <Footer
        siteName={contact.site_name}
        hotline={contact.hotline}
        email={contact.email}
        zaloPhone={contact.zalo_phone}
        logo={branding.logo || undefined}
      />
      <CompareBar />
      <AuthModal />
      <PostModal />
      <FloatingContacts />
    </SiteSettingsProvider>
  );
}
