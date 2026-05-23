import { Router } from 'express'
import { addInternalNote, createTicket, listTickets, updateTicketStatus } from '../controllers/ticket.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const ticketRoutes = Router()

ticketRoutes.use(requireAuth)
ticketRoutes.get('/', listTickets)
ticketRoutes.post('/', createTicket)
ticketRoutes.patch('/:id/status', requireRole('employee', 'admin'), updateTicketStatus)
ticketRoutes.post('/:id/notes', requireRole('employee', 'admin'), addInternalNote)
