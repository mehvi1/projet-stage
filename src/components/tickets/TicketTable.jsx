import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { formatDate } from '../../utils/formatters'
import { sortTicketsByNumber } from '../../utils/tickets'

export function TicketTable({ tickets, basePath }) {
  const orderedTickets = sortTicketsByNumber(tickets)

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {orderedTickets.map((ticket) => (
              <tr key={ticket.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-4">
                  <p className="font-black text-slate-950 dark:text-white">{ticket.id}</p>
                  <p className="mt-1 max-w-xs truncate text-slate-500 dark:text-slate-400">{ticket.subject}</p>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{ticket.client.societes}</td>
                <td className="px-4 py-4">
                  <p className="max-w-xs truncate text-slate-600 dark:text-slate-300">{ticket.description}</p>
                </td>
                <td className="px-4 py-4">
                  <Badge status={ticket.status}>{ticket.status}</Badge>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{ticket.priority}</td>
                <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{formatDate(ticket.createdAt)}</td>
                <td className="px-4 py-4 text-right">
                  <Link className="font-bold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300" to={`${basePath}/${ticket.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
