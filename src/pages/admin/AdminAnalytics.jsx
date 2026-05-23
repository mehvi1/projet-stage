import { Activity, CheckCircle2, Clock3, Eye, Ticket } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { useTicketStore } from '../../store/ticketStore'

function AnalyticsBar({ label, value, total, color }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{value}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 dark:bg-white/10">
        <div className={`h-3 rounded-full ${color}`} style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
      </div>
    </div>
  )
}

export function AdminAnalytics() {
  const tickets = useTicketStore((state) => state.tickets)
  const total = tickets.length
  const pending = tickets.filter((ticket) => ticket.status === 'Pending').length
  const seen = tickets.filter((ticket) => ticket.status === 'Seen').length
  const progress = tickets.filter((ticket) => ticket.status === 'In Progress').length
  const resolved = tickets.filter((ticket) => ticket.status === 'Resolved').length
  const closed = tickets.filter((ticket) => ticket.status === 'Closed').length

  const stats = [
    { label: 'Total tickets', value: total, icon: Ticket, tone: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200' },
    { label: 'Pending', value: pending, icon: Clock3, tone: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200' },
    { label: 'Resolved', value: resolved, icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200' },
    { label: 'Activity events', value: tickets.reduce((sum, ticket) => sum + ticket.history.length, 0), icon: Activity, tone: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Support performance"
        description="Track ticket flow, status distribution, and operational workload for the PBxcom support team."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-lg ${tone}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Status distribution</h2>
          <div className="mt-6 space-y-5">
            <AnalyticsBar label="Pending" value={pending} total={total} color="bg-amber-500" />
            <AnalyticsBar label="Seen" value={seen} total={total} color="bg-sky-500" />
            <AnalyticsBar label="In progress" value={progress} total={total} color="bg-indigo-500" />
            <AnalyticsBar label="Resolved" value={resolved} total={total} color="bg-emerald-500" />
            <AnalyticsBar label="Closed" value={closed} total={total} color="bg-slate-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Operational signal</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Current support queue quality</p>
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-slate-50 p-5 dark:bg-white/5">
            <p className="text-4xl font-black text-slate-950 dark:text-white">{total ? Math.round((resolved / total) * 100) : 0}%</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Resolution rate across visible tickets.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
