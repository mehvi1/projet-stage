import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tickets } from '../data/seedData'
import { api, apiMessage, localDemoEnabled } from '../services/api'
import { nextTicketNumber, sortTicketsByNumber } from '../utils/tickets'

function normalizeTicket(ticket) {
  const id = ticket.publicId ?? ticket.id
  return {
    ...ticket,
    id,
    apiId: ticket._id ?? ticket.apiId,
    userId: ticket.userId ?? ticket.user?.id ?? ticket.user?._id ?? ticket.user,
    createdAt: ticket.createdAt ?? new Date().toISOString(),
    messages: ticket.messages ?? [],
    attachments: ticket.attachments ?? [],
    notes: ticket.notes ?? [],
    history: ticket.history ?? [],
  }
}

function apiTicketId(ticketId, ticketsList) {
  const ticket = ticketsList.find((item) => item.id === ticketId || item.apiId === ticketId)
  return ticket?.apiId ?? ticketId
}

export const useTicketStore = create(
  persist(
    (set, get) => ({
      tickets,
      loadTickets: async () => {
        try {
          const { data } = await api.get('/tickets')
          const normalized = data.map(normalizeTicket)
          set({ tickets: sortTicketsByNumber(normalized) })
          return normalized
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to load tickets.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Tickets cannot synchronize without the backend API.', { cause: error })
          return get().tickets
        }
      },
      createTicket: async (payload, userId) => {
        try {
          const { data } = await api.post('/tickets', payload)
          const ticket = normalizeTicket(data)
          set((state) => ({ tickets: sortTicketsByNumber([...state.tickets.filter((item) => item.id !== ticket.id), ticket]) }))
          return ticket
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to create ticket.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Start the backend API before creating synchronized tickets.', { cause: error })
        }
        const id = nextTicketNumber(get().tickets)
        const ticket = {
          id,
          ticketNumber: id,
          userId,
          createdAt: new Date().toISOString(),
          status: 'Pending',
          priority: payload.priority ?? 'Medium',
          subject: payload.subject,
          description: payload.description,
          client: payload.client,
          adminReadAt: null,
          adminReadBy: null,
          clientReadAt: null,
          clientReadBy: null,
          history: [{ date: new Date().toISOString(), label: 'Ticket created', actor: 'Client' }],
          notes: [],
          messages: [{ body: payload.description, actor: 'Client', actorRole: 'client', createdAt: new Date().toISOString() }],
          attachments: payload.attachments ?? [],
        }
        set((state) => ({ tickets: sortTicketsByNumber([...state.tickets, ticket]) }))
        return ticket
      },
      updateStatus: async (ticketId, status) => {
        try {
          const id = apiTicketId(ticketId, get().tickets)
          const { data } = await api.patch(`/tickets/${id}/status`, { status })
          const ticket = normalizeTicket(data)
          set((state) => ({ tickets: state.tickets.map((item) => (item.id === ticket.id ? ticket : item)) }))
          return ticket
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to update status.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Status changes cannot synchronize without the backend API.', { cause: error })
        }
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  status,
                  history: [
                    ...ticket.history,
                    {
                      date: new Date().toISOString(),
                      label: `Status changed to ${status}`,
                      actor: 'PBxcom',
                    },
                  ],
                }
              : ticket,
          ),
        }))
        return get().getTicket(ticketId)
      },
      markTicketSeenByAdmin: async (ticketId, adminName) => {
        try {
          const id = apiTicketId(ticketId, get().tickets)
          const { data } = await api.post(`/tickets/${id}/seen`)
          const ticket = normalizeTicket(data)
          set((state) => ({ tickets: state.tickets.map((item) => (item.id === ticket.id ? ticket : item)) }))
          return ticket
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to mark ticket as seen.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Ticket read status cannot synchronize without the backend API.', { cause: error })
        }
        let updatedTicket
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId || ticket.adminReadAt) return ticket
            updatedTicket = {
              ...ticket,
              status: ticket.status === 'Pending' ? 'Seen' : ticket.status,
              adminReadAt: new Date().toISOString(),
              adminReadBy: adminName,
              history: [
                ...ticket.history,
                {
                  date: new Date().toISOString(),
                  label: 'Seen by support',
                  actor: adminName,
                },
              ],
            }
            return updatedTicket
          }),
        }))
        return updatedTicket
      },
      markTicketReadByClient: async (ticketId, clientName) => {
        try {
          const id = apiTicketId(ticketId, get().tickets)
          const { data } = await api.post(`/tickets/${id}/client-read`)
          const ticket = normalizeTicket(data)
          set((state) => ({ tickets: state.tickets.map((item) => (item.id === ticket.id ? ticket : item)) }))
          return ticket
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to mark ticket as read.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Ticket read status cannot synchronize without the backend API.', { cause: error })
        }
        let updatedTicket
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId || ticket.clientReadAt) return ticket
            updatedTicket = {
              ...ticket,
              clientReadAt: new Date().toISOString(),
              clientReadBy: clientName,
              history: [
                ...ticket.history,
                {
                  date: new Date().toISOString(),
                  label: 'Seen by client',
                  actor: clientName,
                },
              ],
            }
            return updatedTicket
          }),
        }))
        return updatedTicket
      },
      addNote: async (ticketId, note) => {
        try {
          const id = apiTicketId(ticketId, get().tickets)
          const { data } = await api.post(`/tickets/${id}/notes`, { note })
          const ticket = normalizeTicket(data)
          set((state) => ({ tickets: state.tickets.map((item) => (item.id === ticket.id ? ticket : item)) }))
          return ticket
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to add note.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Notes cannot synchronize without the backend API.', { cause: error })
        }
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, notes: [...ticket.notes, note] } : ticket,
          ),
        }))
        return get().getTicket(ticketId)
      },
      addMessage: async (ticketId, body, user) => {
        try {
          const id = apiTicketId(ticketId, get().tickets)
          const { data } = await api.post(`/tickets/${id}/messages`, { body })
          const ticket = normalizeTicket(data)
          set((state) => ({ tickets: state.tickets.map((item) => (item.id === ticket.id ? ticket : item)) }))
          return ticket
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to add message.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Messages cannot synchronize without the backend API.', { cause: error })
        }
        const message = { body, actor: user.name, actorRole: user.role, createdAt: new Date().toISOString() }
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? {
                  ...ticket,
                  messages: [...(ticket.messages ?? []), message],
                  history: [...ticket.history, { date: new Date().toISOString(), label: 'New message added', actor: user.name }],
                }
              : ticket,
          ),
        }))
        return get().getTicket(ticketId)
      },
      addAttachment: async (ticketId, attachment, user) => {
        try {
          const id = apiTicketId(ticketId, get().tickets)
          const { data } = await api.post(`/tickets/${id}/attachments`, attachment)
          const ticket = normalizeTicket(data)
          set((state) => ({ tickets: state.tickets.map((item) => (item.id === ticket.id ? ticket : item)) }))
          return ticket
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to add attachment.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Attachments cannot synchronize without the backend API.', { cause: error })
        }
        const nextAttachment = { ...attachment, uploadedBy: user.name, uploadedAt: new Date().toISOString() }
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, attachments: [...(ticket.attachments ?? []), nextAttachment] } : ticket,
          ),
        }))
        return get().getTicket(ticketId)
      },
      getTicket: (ticketId) => get().tickets.find((ticket) => ticket.id === ticketId),
    }),
    { name: 'pbxcom-tickets' },
  ),
)
