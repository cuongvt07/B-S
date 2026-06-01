'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const MAX = 3;

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) {
            return { ids: state.ids.filter((x) => x !== id) };
          }
          if (state.ids.length >= MAX) return state;
          return { ids: [...state.ids, id] };
        }),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: 'bds:compare',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
