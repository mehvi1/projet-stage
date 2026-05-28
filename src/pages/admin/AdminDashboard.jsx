import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, CheckCircle2, Clock3, Ticket } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { TicketTable } from '../../components/tickets/TicketTable'
import { useTicketStore } from '../../store/ticketStore'
import { sortTicketsByNumber } from '../../utils/tickets'

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

export function AdminDashboard() {
  const tickets = useTicketStore((state) => state.tickets)
  const orderedTickets = sortTicketsByNumber(tickets)
  const total = tickets.length
  const pending = tickets.filter((ticket) => ticket.status === 'Pending').length
  const resolved = tickets.filter((ticket) => ticket.status === 'Resolved').length
  const progress = tickets.filter((ticket) => ticket.status === 'In Progress').length
  const stats = [
    { label: 'Total tickets', value: total, icon: Ticket },
    { label: 'Pending tickets', value: pending, icon: Clock3 },
    { label: 'Resolved tickets', value: resolved, icon: CheckCircle2 },
    { label: 'Recent activities', value: tickets.reduce((sum, ticket) => sum + ticket.history.length, 0), icon: Activity },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Employee command center"
        title="PBxcom operations dashboard"
        description="Monitor incoming support demand, review service activity, and keep client tickets moving."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Analytics</h2>
          <div className="mt-6 space-y-5">
            <AnalyticsBar label="Pending" value={pending} total={total} color="bg-amber-500" />
            <AnalyticsBar label="In progress" value={progress} total={total} color="bg-indigo-500" />
            <AnalyticsBar label="Resolved" value={resolved} total={total} color="bg-emerald-500" />
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Recent activities</h2>
            <Link to="/admin/tickets" className="text-sm font-bold text-cyan-700 dark:text-cyan-300">Manage tickets</Link>
          </div>
          <div className="space-y-3">
            {tickets.flatMap((ticket) => ticket.history.map((item) => ({ ...item, ticketId: ticket.id }))).slice(-5).reverse().map((item) => (
              <div key={`${item.ticketId}-${item.date}-${item.label}`} className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                <p className="text-sm font-bold text-slate-950 dark:text-white">{item.ticketId}: {item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.actor}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <TicketTable tickets={orderedTickets.slice(0, 5)} basePath="/admin/tickets" />
    </div>
  )
}
