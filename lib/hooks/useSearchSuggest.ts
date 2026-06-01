'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/search';

export function useSearchSuggest(q: string, debounceMs = 200) {
  const [debouncedQ, setDebouncedQ] = useState(q);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), debounceMs);
    return () => clearTimeout(t);
  }, [q, debounceMs]);

  return useQuery({
    queryKey: ['search-suggest', debouncedQ],
    queryFn: () => searchApi.suggest(debouncedQ),
    enabled: debouncedQ.trim().length >= 1,
    staleTime: 30_000,
  });
}
