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
  const statusParam = searchParams.get('status') || 'All'
  const [status, setStatus] = useState(statusParam)
  const [page, setPage] = useState(1)
  const sort = searchParams.get('sort') || 'number'
  const tickets = useTicketStore((state) => state.tickets)

  const filtered = useMemo(
    () => {
      const nextTickets = tickets.filter((ticket) => {
        const haystack = `${ticket.id} ${ticket.subject} ${ticket.description} ${ticket.client.societes} ${ticket.client.nFacture}`.toLowerCase()
        const matchesQuery = haystack.includes(query.toLowerCase())
        const matchesStatus = status === 'All' || ticket.status === status
        return matchesQuery && matchesStatus
      })

      if (sort === 'recent') {
        return [...nextTickets].sort((first, second) => {
          const firstDate = first.history.at(-1)?.date ?? first.updatedAt ?? first.createdAt
          const secondDate = second.history.at(-1)?.date ?? second.updatedAt ?? second.createdAt
          return new Date(secondDate) - new Date(firstDate)
        })
      }

      return sortTicketsByNumber(nextTickets)
    },
    [query, sort, status, tickets],
  )
  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleTickets = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updateStatus = (event) => {
    setStatus(event.target.value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Ticket management" eyebrow="Employee workspace" description="Search, filter, inspect, update, resolve, and print PBxcom support tickets." />
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input label="Search" value={query} onChange={(event) => setTypedQuery(event.target.value)} placeholder="Client, ticket, facture..." />
        <Select label="Status" value={status} onChange={updateStatus}>
          <option>All</option>
          {statusOptions.map((item) => <option key={item}>{item}</option>)}
        </Select>
      </div>
      {filtered.length ? <TicketTable tickets={visibleTickets} basePath="/admin/tickets" /> : <EmptyState title="No tickets found" description="Adjust your filters to see more support requests." action={<Search className="h-5 w-5 text-slate-400" />} />}
      {filtered.length > pageSize ? (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={`grid h-9 w-9 place-items-center rounded-lg border text-sm font-bold transition ${
                pageNumber === currentPage
                  ? 'border-[#7fd22b] bg-[#7fd22b] text-slate-950'
                  : 'border-slate-200 bg-white hover:border-[#7fd22b]/70 dark:border-white/10 dark:bg-white/5'
              }`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
