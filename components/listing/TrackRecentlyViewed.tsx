'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';

export function TrackRecentlyViewed({ listingId }: { listingId: string }) {
  const { add } = useRecentlyViewed();
  useEffect(() => {
    add(listingId);
  }, [listingId, add]);
  return null;
}
