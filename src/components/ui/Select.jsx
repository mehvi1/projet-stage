import clsx from 'clsx'

export function Select({ label, children, className, ...props }) {
  return (
    <label className={clsx('block space-y-2', className)}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <select
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
