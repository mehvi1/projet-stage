import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Paperclip, Printer, Send, StickyNote } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Input'
import { PrintableTicket } from '../../components/tickets/PrintableTicket'
import { TicketTimeline } from '../../components/tickets/TicketTimeline'
import { fileToAttachment } from '../../services/api'
import { statusOptions } from '../../data/seedData'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useTicketStore } from '../../store/ticketStore'
import { useToastStore } from '../../store/toastStore'
import { formatDate } from '../../utils/formatters'
import { NotFound } from '../NotFound'

export function AdminTicketDetail() {
  const { ticketId } = useParams()
  const user = useAuthStore((state) => state.user)
  const ticket = useTicketStore((state) => state.getTicket(ticketId))
  const updateStatus = useTicketStore((state) => state.updateStatus)
  const markTicketSeenByAdmin = useTicketStore((state) => state.markTicketSeenByAdmin)
  const addNote = useTicketStore((state) => state.addNote)
  const addMessage = useTicketStore((state) => state.addMessage)
  const addAttachment = useTicketStore((state) => state.addAttachment)
  const sendEmailNotification = useNotificationStore((state) => state.sendEmailNotification)
  const pushToast = useToastStore((state) => state.pushToast)
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!ticket || ticket.adminReadAt) return
    markTicketSeenByAdmin(ticket.id, user.name)
      .then((updatedTicket) => {
        if (!updatedTicket) return
        sendEmailNotification({
          recipientId: ticket.userId,
          recipientEmail: ticket.client.mail,
          recipientRole: 'client',
          ticketId: ticket.id,
          subject: `Your ticket ${ticket.id} was read`,
          message: `${user.name} opened and read your ticket about: ${ticket.description}`,
        })
        pushToast(`Client email notification sent to ${ticket.client.mail}.`)
      })
      .catch((error) => pushToast(error.message, 'error'))
  }, [markTicketSeenByAdmin, pushToast, sendEmailNotification, ticket, user.name])

  if (!ticket) return <NotFound />

  const handleStatus = async (status) => {
    if (!window.confirm(`Change ticket status to ${status}?`)) return
    await updateStatus(ticket.id, status)
    sendEmailNotification({
      recipientId: ticket.userId,
      recipientEmail: ticket.client.mail,
      recipientRole: 'client',
      ticketId: ticket.id,
      subject: `Ticket ${ticket.id} status updated`,
      message: `${user.name} changed your ticket status to ${status}.`,
    })
    pushToast(`Status updated to ${status}. Client email notification sent.`)
  }

  const saveNote = async () => {
    if (!note.trim()) return
    await addNote(ticket.id, note.trim())
    setNote('')
    pushToast('Internal note added.')
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    await addMessage(ticket.id, message.trim(), user)
    setMessage('')
    sendEmailNotification({
      recipientId: ticket.userId,
      recipientEmail: ticket.client.mail,
      recipientRole: 'client',
      ticketId: ticket.id,
      subject: `New reply on ticket ${ticket.id}`,
      message: `${user.name} replied to your ticket.`,
    })
    pushToast('Reply sent to client.')
  }

  const uploadAttachment = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    await addAttachment(ticket.id, await fileToAttachment(file), user)
    pushToast('Attachment added.')
    event.target.value = ''
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
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Client conversation</h2>
            <div className="mt-4 space-y-2">
              {(ticket.messages ?? []).map((item, index) => (
                <div key={`${item.createdAt}-${index}`} className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                  <p className="text-sm font-bold text-slate-950 dark:text-white">{item.actor}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                  <p className="mt-2 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
            <Textarea className="mt-4" label="Reply to client" value={message} onChange={(event) => setMessage(event.target.value)} />
            <Button className="mt-3 w-full" onClick={sendMessage} disabled={ticket.status === 'Closed'}>
              <Send className="h-4 w-4" />
              Send reply
            </Button>
          </Card>
          <Card>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Attachments</h2>
            <div className="mt-4 space-y-2">
              {(ticket.attachments ?? []).length ? ticket.attachments.map((attachment, index) => (
                <a key={`${attachment.name}-${index}`} href={attachment.dataUrl} download={attachment.name} className="block rounded-lg bg-slate-50 p-3 text-sm font-semibold text-cyan-700 dark:bg-white/5 dark:text-cyan-300">
                  {attachment.name}
                </a>
              )) : <p className="text-sm text-slate-500 dark:text-slate-400">No attachments yet.</p>}
            </div>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">
              <Paperclip className="h-4 w-4" />
              Add attachment
              <input className="sr-only" type="file" onChange={uploadAttachment} />
            </label>
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
