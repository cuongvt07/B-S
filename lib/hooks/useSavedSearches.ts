'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'bds:saved-searches';

export interface SavedSearch {
  id: string;
  label: string;
  createdAt: string;
  params: Record<string, string>;
}

function readStorage(): SavedSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items: SavedSearch[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function makeId(): string {
  const t = Date.now().toString(36);
  const r = Math.floor(Math.random() * 1000).toString(36);
  return `s${t}${r}`;
}

export function useSavedSearches(): {
  items: SavedSearch[];
  save: (label: string, params: Record<string, string>) => SavedSearch;
  remove: (id: string) => void;
  hydrated: boolean;
} {
  const [items, setItems] = useState<SavedSearch[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  const save = useCallback((label: string, params: Record<string, string>): SavedSearch => {
    const entry: SavedSearch = {
      id: makeId(),
      label,
      createdAt: new Date().toISOString(),
      params,
    };
    setItems((prev) => {
      const next = [entry, ...prev];
      writeStorage(next);
      return next;
    });
    return entry;
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  return { items, save, remove, hydrated };
}
