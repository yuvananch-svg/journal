'use client';
import { create } from 'zustand';
type UI = {
  leftOpen: boolean;
  rightOpen: boolean;
  light: boolean;
  hideAmounts: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleTheme: () => void;
  toggleAmounts: () => void;
};
export const useUI = create<UI>((set) => ({
  leftOpen: true,
  rightOpen: true,
  light: false,
  hideAmounts: false,
  toggleLeft: () => set((s) => ({ leftOpen: !s.leftOpen })),
  toggleRight: () => set((s) => ({ rightOpen: !s.rightOpen })),
  toggleTheme: () => set((s) => ({ light: !s.light })),
  toggleAmounts: () => set((s) => ({ hideAmounts: !s.hideAmounts })),
}));
