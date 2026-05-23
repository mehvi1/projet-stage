import clsx from 'clsx'

export function Card({ children, className }) {
  return (
    <section
      className={clsx(
        'rounded-lg border border-slate-200/80 bg-white/88 p-5 shadow-sm shadow-slate-900/5 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7fd22b]/45 hover:shadow-lg hover:shadow-[#7fd22b]/10 dark:border-white/10 dark:bg-slate-900/75 dark:hover:border-[#7fd22b]/35',
        className,
      )}
    >
      {children}
    </section>
  )
}
