import { Notification } from '../models/Notification.js'

export function normalizeNotification(notification) {
  return {
    id: notification.id,
    recipientId: String(notification.recipient?._id ?? notification.recipient),
    recipientEmail: notification.recipientEmail,
    recipientRole: notification.recipientRole,
    subject: notification.subject,
    message: notification.message,
    ticketId: notification.ticketPublicId,
    channel: notification.channel,
    read: notification.read,
    createdAt: notification.createdAt,
  }
}

export async function createNotification({ recipient, subject, message, ticketPublicId, channel = 'gmail' }) {
  if (!recipient?._id && !recipient?.id) return null

  const notification = await Notification.create({
    recipient: recipient._id ?? recipient.id,
    recipientEmail: recipient.email,
    recipientRole: recipient.role,
    subject,
    message,
    ticketPublicId,
    channel,
  })

  return normalizeNotification(notification)
}

export async function createNotifications(items) {
  const notifications = await Promise.all(items.map((item) => createNotification(item)))
  return notifications.filter(Boolean)
}
