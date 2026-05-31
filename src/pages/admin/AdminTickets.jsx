import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { TicketTable } from '../../components/tickets/TicketTable'
import { statusOptions } from '../../data/seedData'
import { useTicketStore } from '../../store/ticketStore'
import { sortTicketsByNumber } from '../../utils/tickets'

export function AdminTickets() {
  const [searchParams] = useSearchParams()
  const [typedQuery, setTypedQuery] = useState('')
  const query = typedQuery || searchParams.get('q') || ''
  const [status, setStatus] = useState('All')
  const tickets = useTicketStore((state) => state.tickets)

  const filtered = useMemo(
    () =>
      sortTicketsByNumber(
        tickets.filter((ticket) => {
          const haystack = `${ticket.id} ${ticket.subject} ${ticket.description} ${ticket.client.societes} ${ticket.client.nFacture}`.toLowerCase()
          const matchesQuery = haystack.includes(query.toLowerCase())
          const matchesStatus = status === 'All' || ticket.status === status
          return matchesQuery && matchesStatus
        }),
      ),
    [query, status, tickets],
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Ticket management" eyebrow="Employee workspace" description="Search, filter, inspect, update, resolve, and print PBxcom support tickets." />
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input label="Search" value={query} onChange={(event) => setTypedQuery(event.target.value)} placeholder="Client, ticket, facture..." />
        <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          {statusOptions.map((item) => <option key={item}>{item}</option>)}
        </Select>
      </div>
      {filtered.length ? <TicketTable tickets={filtered} basePath="/admin/tickets" /> : <EmptyState title="No tickets found" description="Adjust your filters to see more support requests." action={<Search className="h-5 w-5 text-slate-400" />} />}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((page) => (
          <button key={page} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-sm font-bold dark:border-white/10 dark:bg-white/5">
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}
