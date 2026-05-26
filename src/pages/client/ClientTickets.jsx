import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { FilePlus2, Search } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { TicketTable } from '../../components/tickets/TicketTable'
import { statusOptions } from '../../data/seedData'
import { useAuthStore } from '../../store/authStore'
import { useTicketStore } from '../../store/ticketStore'

export function ClientTickets() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const user = useAuthStore((state) => state.user)
  const allTickets = useTicketStore((state) => state.tickets)
  const tickets = useMemo(() => allTickets.filter((ticket) => ticket.userId === user.id), [allTickets, user.id])

  const filtered = useMemo(
    () =>
      tickets.filter((ticket) => {
        const matchesQuery = `${ticket.id} ${ticket.subject} ${ticket.description}`.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = status === 'All' || ticket.status === status
        return matchesQuery && matchesStatus
      }),
    [query, status, tickets],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ticket history"
        eyebrow="Client support"
        description="Search your previous requests and track status updates from PBxcom."
        action={<Button as={Link} to="/client/new"><FilePlus2 className="h-4 w-4" /> Create new ticket</Button>}
      />
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input label="Search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ticket ID or subject" />
        <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          {statusOptions.map((item) => <option key={item}>{item}</option>)}
        </Select>
      </div>
      {filtered.length ? <TicketTable tickets={filtered} basePath="/client/tickets" /> : <EmptyState title="No tickets found" description="Try another search or create a new support ticket." action={<Search className="h-5 w-5 text-slate-400" />} />}
    </div>
  )
}
