import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tickets } from '../data/seedData'

export const useTicketStore = create(
  persist(
    (set, get) => ({
      tickets,
      createTicket: (payload, userId) => {
        const id = `PBX-${Math.floor(24000 + Math.random() * 9000)}`
        const ticket = {
          id,
          userId,
          createdAt: new Date().toISOString(),
          status: 'Pending',
          priority: payload.priority ?? 'Medium',
          subject: payload.subject,
          description: payload.description,
          client: payload.client,
          adminReadAt: null,
          adminReadBy: null,
          history: [{ date: new Date().toISOString(), label: 'Ticket created', actor: 'Client' }],
          notes: [],
        }
        set((state) => ({ tickets: [ticket, ...state.tickets] }))
        return ticket
      },
      updateStatus: (ticketId, status) =>
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
        })),
      markTicketSeenByAdmin: (ticketId, adminName) => {
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
      addNote: (ticketId, note) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, notes: [...ticket.notes, note] } : ticket,
          ),
        })),
      getTicket: (ticketId) => get().tickets.find((ticket) => ticket.id === ticketId),
    }),
    { name: 'pbxcom-tickets' },
  ),
)
