import { Ticket } from '../models/Ticket.js'

function nextPublicId() {
  return `PBX-${Math.floor(10000 + Math.random() * 90000)}`
}

export async function createTicket(req, res, next) {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      publicId: nextPublicId(),
      user: req.user.id,
      history: [{ label: 'Ticket created', actor: req.user.name }],
    })
    res.status(201).json(ticket)
  } catch (error) {
    next(error)
  }
}

export async function listTickets(req, res, next) {
  try {
    const query = req.user.role === 'client' ? { user: req.user.id } : {}
    const tickets = await Ticket.find(query).sort({ createdAt: -1 }).populate('user', 'name email company')
    res.json(tickets)
  } catch (error) {
    next(error)
  }
}

export async function updateTicketStatus(req, res, next) {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        $push: { history: { label: `Status changed to ${req.body.status}`, actor: req.user.name } },
      },
      { new: true },
    )
    res.json(ticket)
  } catch (error) {
    next(error)
  }
}

export async function addInternalNote(req, res, next) {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { $push: { notes: req.body.note } }, { new: true })
    res.json(ticket)
  } catch (error) {
    next(error)
  }
}
