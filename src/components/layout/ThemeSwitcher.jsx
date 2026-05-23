import { Monitor, Moon, Sun } from 'lucide-react'
import clsx from 'clsx'
import { useThemeStore } from '../../store/themeStore'

const themes = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
]

export function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
      {themes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          title={label}
          aria-label={label}
          onClick={() => setTheme(id)}
          className={clsx(
            'grid h-9 w-9 place-items-center rounded-md transition',
            theme === id
              ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
