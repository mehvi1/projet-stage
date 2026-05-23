import { formatDate } from '../../utils/formatters'

export function TicketTimeline({ history }) {
  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={`${item.date}-${item.label}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-cyan-500" />
            {index < history.length - 1 ? <div className="mt-2 h-full w-px bg-slate-200 dark:bg-white/10" /> : null}
          </div>
          <div className="pb-4">
            <p className="text-sm font-bold text-slate-950 dark:text-white">{item.label}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {formatDate(item.date)} by {item.actor}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
