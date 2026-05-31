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
      messages: [{ body: req.body.description, actor: req.user.name, actorRole: req.user.role }],
      attachments: (req.body.attachments ?? []).map((attachment) => ({ ...attachment, uploadedBy: req.user.name })),
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
    const existingTicket = await Ticket.findById(req.params.id)
    if (!existingTicket) return res.status(404).json({ message: 'Ticket not found' })
    if (existingTicket.status === 'Closed') return res.status(400).json({ message: 'Closed tickets cannot be updated' })

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

export async function markTicketSeen(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    if (!ticket.adminReadAt) {
      ticket.adminReadAt = new Date()
      ticket.adminReadBy = req.user.name
      if (ticket.status === 'Pending') ticket.status = 'Seen'
      ticket.history.push({ label: 'Seen by support', actor: req.user.name })
      await ticket.save()
    }
    res.json(ticket)
  } catch (error) {
    next(error)
  }
}

export async function addMessage(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    if (req.user.role === 'client' && String(ticket.user) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (ticket.status === 'Closed') return res.status(400).json({ message: 'Closed tickets cannot receive messages' })

    ticket.messages.push({ body: req.body.body, actor: req.user.name, actorRole: req.user.role })
    ticket.history.push({ label: 'New message added', actor: req.user.name })
    await ticket.save()
    res.json(ticket)
  } catch (error) {
    next(error)
  }
}

export async function addAttachment(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    if (req.user.role === 'client' && String(ticket.user) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    ticket.attachments.push({ ...req.body, uploadedBy: req.user.name })
    ticket.history.push({ label: `Attachment added: ${req.body.name}`, actor: req.user.name })
    await ticket.save()
    res.json(ticket)
  } catch (error) {
    next(error)
  }
}
