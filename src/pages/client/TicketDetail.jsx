import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Paperclip, Send } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Textarea } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { TicketTimeline } from '../../components/tickets/TicketTimeline'
import { fileToAttachment } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useTicketStore } from '../../store/ticketStore'
import { useToastStore } from '../../store/toastStore'
import { emailDeliveryMessage } from '../../utils/emailDelivery'
import { formatDate } from '../../utils/formatters'
import { NotFound } from '../NotFound'

export function TicketDetail() {
  const { ticketId } = useParams()
  const [message, setMessage] = useState('')
  const user = useAuthStore((state) => state.user)
  const users = useAuthStore((state) => state.users)
  const ticket = useTicketStore((state) => state.getTicket(ticketId))
  const markTicketReadByClient = useTicketStore((state) => state.markTicketReadByClient)
  const addMessage = useTicketStore((state) => state.addMessage)
  const addAttachment = useTicketStore((state) => state.addAttachment)
  const sendEmailNotification = useNotificationStore((state) => state.sendEmailNotification)
  const pushToast = useToastStore((state) => state.pushToast)

  useEffect(() => {
    if (!ticket || ticket.userId !== user.id || ticket.clientReadAt) return
    markTicketReadByClient(ticket.id, user.name)
      .then((updatedTicket) => {
        if (!updatedTicket) return
        users
          .filter((item) => ['admin', 'employee'].includes(item.role))
          .forEach((admin) => {
            sendEmailNotification({
              recipientId: admin.id,
              recipientEmail: admin.email,
              recipientRole: admin.role,
              ticketId: ticket.id,
              subject: `Ticket ${ticket.id} was read by client`,
              message: `${user.name} opened and read ticket ${ticket.id}.`,
            })
          })
      })
      .catch((error) => pushToast(error.message, 'error'))
  }, [markTicketReadByClient, pushToast, sendEmailNotification, ticket, user.id, user.name, users])

  if (!ticket || ticket.userId !== user.id) return <NotFound />

  const sendMessage = async () => {
    if (!message.trim()) return
    try {
      const updatedTicket = await addMessage(ticket.id, message.trim(), user)
      setMessage('')
      const delivery = emailDeliveryMessage(updatedTicket, 'Message saved.')
      pushToast(delivery.message, delivery.tone)
    } catch (error) {
      pushToast(error.message, 'error')
    }
  }

  const uploadAttachment = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      await addAttachment(ticket.id, await fileToAttachment(file), user)
      pushToast('Attachment added.')
    } catch (error) {
      pushToast(error.message, 'error')
    }
    event.target.value = ''
  }

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
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Conversation</h2>
          <div className="mt-4 space-y-3">
            {(ticket.messages ?? []).map((item, index) => (
              <div key={`${item.createdAt}-${index}`} className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                <p className="text-sm font-bold text-slate-950 dark:text-white">{item.actor}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
                <p className="mt-2 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
          <Textarea className="mt-4" label="Reply" value={message} onChange={(event) => setMessage(event.target.value)} />
          <Button className="mt-3" onClick={sendMessage} disabled={ticket.status === 'Closed'}>
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
      </div>
    </div>
  )
}
