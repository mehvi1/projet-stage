import clsx from 'clsx'

const variants = {
  primary:
    'bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:-translate-y-0.5 hover:bg-[#7fd22b] hover:text-slate-950 dark:bg-[#7fd22b] dark:text-slate-950 dark:shadow-[#7fd22b]/20 dark:hover:bg-[#93dd45]',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:border-[#7fd22b]/60 hover:bg-[#7fd22b]/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-[#7fd22b]/50 dark:hover:bg-[#7fd22b]/10',
  ghost: 'text-slate-600 hover:bg-[#7fd22b]/10 dark:text-slate-300 dark:hover:bg-[#7fd22b]/10',
  danger: 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700',
}

export function Button({ as: Component = 'button', children, className, variant = 'primary', ...props }) {
  return (
    <Component
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      type={Component === 'button' ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}
