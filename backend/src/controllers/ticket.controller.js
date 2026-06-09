import { Ticket } from '../models/Ticket.js'
import { User } from '../models/User.js'
import { appUrl, sendEmail, sendEmails } from '../services/email.service.js'
import { createNotification, createNotifications } from '../services/notification.service.js'

function formatTicketNumber(value) {
  return String(value).padStart(5, '0')
}

function withEmailNotification(ticket, emailNotification) {
  return { ...ticket.toObject(), emailNotification }
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
    const supportUsers = await User.find({ role: { $in: ['employee', 'admin'] }, active: true }).select('email name role')
    const subject = `New PBxcom ticket ${ticket.publicId}`
    const message = `${req.user.name} created a new ticket for ${ticket.client.societes}.`
    const emailNotification = await sendEmails(
      supportUsers.map((supportUser) => ({
        to: supportUser.email,
        subject,
        text: `${req.user.name} created ticket ${ticket.publicId}: ${ticket.description}\n\nOpen it: ${appUrl(`/admin/tickets/${ticket.publicId}`)}`,
        html: `<p>${req.user.name} created ticket <strong>${ticket.publicId}</strong>.</p><p>${ticket.description}</p><p><a href="${appUrl(`/admin/tickets/${ticket.publicId}`)}">Open ticket</a></p>`,
      })),
    )
    await createNotifications(
      supportUsers.map((supportUser) => ({
        recipient: supportUser,
        subject,
        message,
        ticketPublicId: ticket.publicId,
      })),
    )
    res.status(201).json(withEmailNotification(ticket, emailNotification))
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
    ).populate('user', 'email name')
    const subject = `Ticket ${ticket.publicId} status updated`
    const message = `${req.user.name} changed your ticket status to ${ticket.status}.`
    const emailNotification = await sendEmail({
      to: ticket.client.mail || ticket.user?.email,
      subject,
      text: `Your ticket ${ticket.publicId} status is now: ${ticket.status}.\n\nOpen it: ${appUrl(`/client/tickets/${ticket.publicId}`)}`,
      html: `<p>Your ticket <strong>${ticket.publicId}</strong> status is now <strong>${ticket.status}</strong>.</p><p><a href="${appUrl(`/client/tickets/${ticket.publicId}`)}">Open ticket</a></p>`,
    })
    await createNotification({
      recipient: ticket.user,
      subject,
      message,
      ticketPublicId: ticket.publicId,
    })
    res.json(withEmailNotification(ticket, emailNotification))
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
    const ticket = await Ticket.findById(req.params.id).populate('user', 'email name')
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    let emailNotification
    if (!ticket.adminReadAt) {
      ticket.adminReadAt = new Date()
      ticket.adminReadBy = req.user.name
      if (ticket.status === 'Pending') ticket.status = 'Seen'
      ticket.history.push({ label: 'Seen by support', actor: req.user.name })
      await ticket.save()
      const subject = `Ticket ${ticket.publicId} was read`
      const message = `${req.user.name} opened and read your ticket.`
      emailNotification = await sendEmail({
        to: ticket.client.mail || ticket.user?.email,
        subject,
        text: `${req.user.name} opened and read your ticket ${ticket.publicId}.\n\nOpen it: ${appUrl(`/client/tickets/${ticket.publicId}`)}`,
        html: `<p>${req.user.name} opened and read your ticket <strong>${ticket.publicId}</strong>.</p><p><a href="${appUrl(`/client/tickets/${ticket.publicId}`)}">Open ticket</a></p>`,
      })
      await createNotification({
        recipient: ticket.user,
        subject,
        message,
        ticketPublicId: ticket.publicId,
      })
    }
    res.json(withEmailNotification(ticket, emailNotification))
  } catch (error) {
    next(error)
  }
}

export async function markTicketReadByClient(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'email name')
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    if (String(ticket.user?._id ?? ticket.user) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    let emailNotification
    if (!ticket.clientReadAt) {
      ticket.clientReadAt = new Date()
      ticket.clientReadBy = req.user.name
      ticket.history.push({ label: 'Seen by client', actor: req.user.name })
      await ticket.save()

      const supportUsers = await User.find({ role: { $in: ['employee', 'admin'] }, active: true }).select('email role')
      const subject = `Ticket ${ticket.publicId} was read by client`
      const message = `${req.user.name} opened and read ticket ${ticket.publicId}.`
      emailNotification = await sendEmails(
        supportUsers.map((supportUser) => ({
          to: supportUser.email,
          subject,
          text: `${req.user.name} opened and read ticket ${ticket.publicId}.\n\nOpen it: ${appUrl(`/admin/tickets/${ticket.publicId}`)}`,
          html: `<p>${req.user.name} opened and read ticket <strong>${ticket.publicId}</strong>.</p><p><a href="${appUrl(`/admin/tickets/${ticket.publicId}`)}">Open ticket</a></p>`,
        })),
      )
      await createNotifications(
        supportUsers.map((supportUser) => ({
          recipient: supportUser,
          subject,
          message,
          ticketPublicId: ticket.publicId,
        })),
      )
    }
    res.json(withEmailNotification(ticket, emailNotification))
  } catch (error) {
    next(error)
  }
}

export async function addMessage(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'email name')
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
    if (req.user.role === 'client' && String(ticket.user?._id ?? ticket.user) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (ticket.status === 'Closed') return res.status(400).json({ message: 'Closed tickets cannot receive messages' })

    ticket.messages.push({ body: req.body.body, actor: req.user.name, actorRole: req.user.role })
    ticket.history.push({ label: 'New message added', actor: req.user.name })
    await ticket.save()
    const supportUsers = req.user.role === 'client'
      ? await User.find({ role: { $in: ['employee', 'admin'] }, active: true }).select('email role')
      : []
    const recipients = req.user.role === 'client'
      ? supportUsers.map((user) => user.email)
      : [ticket.client.mail || ticket.user?.email]
    const subject = `New message on ticket ${ticket.publicId}`
    const message = `${req.user.name} added a message on ticket ${ticket.publicId}.`
    const emailNotification = await sendEmails(
      recipients.filter(Boolean).map((recipient) => ({
        to: recipient,
        subject,
        text: `${req.user.name} added a message:\n\n${req.body.body}\n\nOpen it: ${appUrl(req.user.role === 'client' ? `/admin/tickets/${ticket.publicId}` : `/client/tickets/${ticket.publicId}`)}`,
        html: `<p>${req.user.name} added a message on ticket <strong>${ticket.publicId}</strong>.</p><p>${req.body.body}</p><p><a href="${appUrl(req.user.role === 'client' ? `/admin/tickets/${ticket.publicId}` : `/client/tickets/${ticket.publicId}`)}">Open ticket</a></p>`,
      })),
    )
    if (req.user.role === 'client') {
      await createNotifications(
        supportUsers.map((supportUser) => ({
          recipient: supportUser,
          subject,
          message,
          ticketPublicId: ticket.publicId,
        })),
      )
    } else {
      await createNotification({
        recipient: ticket.user,
        subject,
        message,
        ticketPublicId: ticket.publicId,
      })
    }
    res.json(withEmailNotification(ticket, emailNotification))
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
