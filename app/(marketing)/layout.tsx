import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingContacts } from '@/components/layout/FloatingContacts';
import { CompareBar } from '@/components/listing';
import { AuthModal } from '@/components/auth';
import { getSiteSettings } from '@/lib/server-data';

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const { branding, contact } = await getSiteSettings();
  return (
    <>
      <Header logoUrl={branding.logo || undefined} siteName={contact.site_name} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
      <AuthModal />
      <FloatingContacts />
    </>
  );
}
