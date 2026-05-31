import { Router } from 'express'
import {
  addAttachment,
  addInternalNote,
  addMessage,
  createTicket,
  listTickets,
  markTicketSeen,
  updateTicketStatus,
} from '../controllers/ticket.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const ticketRoutes = Router()

ticketRoutes.use(requireAuth)
ticketRoutes.get('/', listTickets)
ticketRoutes.post('/', createTicket)
ticketRoutes.post('/:id/seen', requireRole('employee', 'admin'), markTicketSeen)
ticketRoutes.post('/:id/messages', addMessage)
ticketRoutes.post('/:id/attachments', addAttachment)
ticketRoutes.patch('/:id/status', requireRole('employee', 'admin'), updateTicketStatus)
ticketRoutes.post('/:id/notes', requireRole('employee', 'admin'), addInternalNote)
