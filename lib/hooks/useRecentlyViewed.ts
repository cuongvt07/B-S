'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'bds:recently-viewed';
const MAX = 10;

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeStorage(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // ignore quota / private mode
  }
}

export function useRecentlyViewed(): {
  ids: string[];
  add: (id: string) => void;
  clear: () => void;
  hydrated: boolean;
} {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(readStorage());
    setHydrated(true);
  }, []);

  const add = useCallback((id: string) => {
    setIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX);
      writeStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    writeStorage([]);
  }, []);

  return { ids, add, clear, hydrated };
}
