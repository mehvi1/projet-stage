import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'pbxcom-theme' },
  ),
)

function resolveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export function useThemeBootstrap() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const applyTheme = () => {
      document.documentElement.classList.toggle('dark', resolveTheme(theme) === 'dark')
    }
    applyTheme()

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])
}
