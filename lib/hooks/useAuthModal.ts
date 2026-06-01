'use client';

import { create } from 'zustand';

export type AuthView = 'login' | 'register';

interface AuthModalState {
  open: boolean;
  view: AuthView;
  nextUrl?: string;
  openLogin: (nextUrl?: string) => void;
  openRegister: (nextUrl?: string) => void;
  setView: (view: AuthView) => void;
  close: () => void;
}

export const useAuthModal = create<AuthModalState>((set) => ({
  open: false,
  view: 'login',
  nextUrl: undefined,
  openLogin: (nextUrl) => set({ open: true, view: 'login', nextUrl }),
  openRegister: (nextUrl) => set({ open: true, view: 'register', nextUrl }),
  setView: (view) => set({ view }),
  close: () => set({ open: false }),
}));
