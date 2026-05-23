import { create } from 'zustand'

export const useToastStore = create((set) => ({
  toasts: [],
  pushToast: (message, type = 'success') =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
