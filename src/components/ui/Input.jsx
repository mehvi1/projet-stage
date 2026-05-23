import clsx from 'clsx'

export function Input({ label, error, className, ...props }) {
  return (
    <label className={clsx('block space-y-2', className)}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-white dark:focus:ring-white/10',
          error ? 'border-rose-400' : 'border-slate-200',
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  )
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <label className={clsx('block space-y-2', className)}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <textarea
        className={clsx(
          'min-h-32 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-white dark:focus:ring-white/10',
          error ? 'border-rose-400' : 'border-slate-200',
        )}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span> : null}
    </label>
  )
}
