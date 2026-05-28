import { Ticket } from '../models/Ticket.js'

function formatTicketNumber(value) {
  return String(value).padStart(5, '0')
}

async function nextPublicId() {
  const latestTicket = await Ticket.findOne().sort({ publicId: -1 }).select('publicId')
  const latestNumber = latestTicket ? Number.parseInt(latestTicket.publicId, 10) || 0 : 0
  return formatTicketNumber(latestNumber + 1)
}

export async function createTicket(req, res, next) {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      publicId: await nextPublicId(),
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
    const tickets = await Ticket.find(query).sort({ publicId: 1 }).populate('user', 'name email company')
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
