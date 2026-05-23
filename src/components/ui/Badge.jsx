import clsx from 'clsx'
import { statusTone } from '../../utils/formatters'

export function Badge({ children, tone, status }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold',
        status ? statusTone(status) : tone,
      )}
    >
      {children}
    </span>
  )
}
