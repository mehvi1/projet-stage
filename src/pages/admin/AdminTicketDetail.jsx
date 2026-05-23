import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Printer, StickyNote } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Input'
import { PrintableTicket } from '../../components/tickets/PrintableTicket'
import { TicketTimeline } from '../../components/tickets/TicketTimeline'
import { statusOptions } from '../../data/seedData'
import { useTicketStore } from '../../store/ticketStore'
import { useToastStore } from '../../store/toastStore'
import { formatDate } from '../../utils/formatters'
import { NotFound } from '../NotFound'

export function AdminTicketDetail() {
  const { ticketId } = useParams()
  const ticket = useTicketStore((state) => state.getTicket(ticketId))
  const updateStatus = useTicketStore((state) => state.updateStatus)
  const addNote = useTicketStore((state) => state.addNote)
  const pushToast = useToastStore((state) => state.pushToast)
  const [note, setNote] = useState('')

  if (!ticket) return <NotFound />

  const handleStatus = (status) => {
    updateStatus(ticket.id, status)
    pushToast(`Status updated to ${status}.`)
  }

  const saveNote = () => {
    if (!note.trim()) return
    addNote(ticket.id, note.trim())
    setNote('')
    pushToast('Internal note added.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={ticket.id}
        title={ticket.subject}
        description={`Created ${formatDate(ticket.createdAt)} for ${ticket.client.societes}`}
        action={<Button as={Link} to="/admin/tickets" variant="secondary"><ArrowLeft className="h-4 w-4" /> Back</Button>}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <PrintableTicket ticket={ticket} />
          <Card className="no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge status={ticket.status}>{ticket.status}</Badge>
                <p className="mt-3 text-slate-600 dark:text-slate-300">{ticket.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button onClick={() => handleStatus('Resolved')}>
                  <CheckCircle2 className="h-4 w-4" />
                  Resolve
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-6 no-print">
          <Card>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Status control</h2>
            <Select className="mt-4" label="Current status" value={ticket.status} onChange={(event) => handleStatus(event.target.value)}>
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </Select>
          </Card>
          <Card>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Internal notes</h2>
            <Textarea className="mt-4" label="Add note" value={note} onChange={(event) => setNote(event.target.value)} />
            <Button className="mt-3 w-full" variant="secondary" onClick={saveNote}>
              <StickyNote className="h-4 w-4" />
              Save note
            </Button>
            <div className="mt-5 space-y-2">
              {ticket.notes.length ? ticket.notes.map((item, index) => (
                <p key={`${item}-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">{item}</p>
              )) : <p className="text-sm text-slate-500 dark:text-slate-400">No internal notes yet.</p>}
            </div>
          </Card>
          <Card>
            <h2 className="mb-5 text-lg font-black text-slate-950 dark:text-white">History</h2>
            <TicketTimeline history={ticket.history} />
          </Card>
        </div>
      </div>
    </div>
  )
}
