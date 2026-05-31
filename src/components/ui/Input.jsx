import clsx from 'clsx'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function FieldLabel({ label, required }) {
  return (
    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </span>
  )
}

export function Input({ label, error, className, required, ...props }) {
  return (
    <label className={clsx('block space-y-2', className)}>
      <FieldLabel label={label} required={required} />
      <input
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-white dark:focus:ring-white/10',
          'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-inner dark:disabled:border-white/10 dark:disabled:bg-slate-800/80 dark:disabled:text-slate-400',
          error ? 'border-rose-400' : 'border-slate-200',
        )}
        required={required}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  )
}

export function PasswordInput({ label, error, className, required, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className={clsx('block space-y-2', className)}>
      <FieldLabel label={label} required={required} />
      <div className="relative">
        <input
          className={clsx(
            'w-full rounded-lg border bg-white px-3 py-2.5 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-white dark:focus:ring-white/10',
            'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-inner dark:disabled:border-white/10 dark:disabled:bg-slate-800/80 dark:disabled:text-slate-400',
            error ? 'border-rose-400' : 'border-slate-200',
          )}
          type={visible ? 'text' : 'password'}
          required={required}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <span className="text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  )
}

export function Textarea({ label, error, className, required, ...props }) {
  return (
    <label className={clsx('block space-y-2', className)}>
      <FieldLabel label={label} required={required} />
      <textarea
        className={clsx(
          'min-h-32 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-white dark:focus:ring-white/10',
          error ? 'border-rose-400' : 'border-slate-200',
        )}
        required={required}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  )
}
