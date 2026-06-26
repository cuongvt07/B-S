'use client';

import { create } from 'zustand';

export type PostVertical = 'property' | 'vehicle';

interface PostModalState {
  open: boolean;
  vertical: PostVertical;
  editId?: string;
  openPost: (vertical?: PostVertical, editId?: string) => void;
  setVertical: (vertical: PostVertical) => void;
  close: () => void;
}

export const usePostModal = create<PostModalState>((set) => ({
  open: false,
  vertical: 'property',
  editId: undefined,
  openPost: (vertical = 'property', editId) => set({ open: true, vertical, editId }),
  setVertical: (vertical) => set({ vertical }),
  close: () => set({ open: false, editId: undefined }),
}));
