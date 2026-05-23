import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { TicketTimeline } from '../../components/tickets/TicketTimeline'
import { useTicketStore } from '../../store/ticketStore'
import { formatDate } from '../../utils/formatters'
import { NotFound } from '../NotFound'

export function TicketDetail() {
  const { ticketId } = useParams()
  const ticket = useTicketStore((state) => state.getTicket(ticketId))

  if (!ticket) return <NotFound />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={ticket.id}
        title={ticket.subject}
        description={`Created ${formatDate(ticket.createdAt)}`}
        action={<Button as={Link} to="/client/tickets" variant="secondary"><ArrowLeft className="h-4 w-4" /> Back</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Badge status={ticket.status}>{ticket.status}</Badge>
            <Badge tone="bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">{ticket.priority}</Badge>
          </div>
          <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-white">Problem description</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{ticket.description}</p>
          <h2 className="mt-8 text-lg font-black text-slate-950 dark:text-white">Client information</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.entries(ticket.client).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                <dt className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <h2 className="mb-5 text-lg font-black text-slate-950 dark:text-white">Status updates</h2>
          <TicketTimeline history={ticket.history} />
        </Card>
      </div>
    </div>
  )
}
