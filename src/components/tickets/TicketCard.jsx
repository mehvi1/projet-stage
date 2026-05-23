import { Link } from 'react-router-dom'
import { ArrowUpRight, Building2, CalendarClock } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { formatDate } from '../../utils/formatters'

export function TicketCard({ ticket, basePath }) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-slate-950 dark:text-white">{ticket.id}</p>
            <Badge status={ticket.status}>{ticket.status}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{ticket.subject}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{ticket.description}</p>
        </div>
        <Link
          to={`${basePath}/${ticket.id}`}
          aria-label={`Open ${ticket.id}`}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-950 hover:text-white dark:border-white/10 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {ticket.client.societes}
        </span>
        <span className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          {formatDate(ticket.createdAt)}
        </span>
      </div>
    </Card>
  )
}
