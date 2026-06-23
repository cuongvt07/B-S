'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { SITE } from '@/lib/constants';

export type PublicSiteSettings = {
  siteName: string;
  tagline: string;
  logo: string;
  hotline: string;
  zaloPhone: string;
  email: string;
};

const FALLBACK: PublicSiteSettings = {
  siteName: SITE.name,
  tagline: SITE.tagline,
  logo: '',
  hotline: SITE.contactPhone,
  zaloPhone: SITE.contactPhone,
  email: SITE.contactEmail,
};

const SiteSettingsContext = createContext<PublicSiteSettings>(FALLBACK);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: PublicSiteSettings;
  children: ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

/** Read configured site settings in client components (falls back to constants). */
export function useSiteSettings(): PublicSiteSettings {
  return useContext(SiteSettingsContext);
}
