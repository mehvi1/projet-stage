import { Notification } from '../models/Notification.js'
import { normalizeNotification } from '../services/notification.service.js'

export async function listNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 }).limit(50)
    res.json(notifications.map(normalizeNotification))
  } catch (error) {
    next(error)
  }
}

export async function markNotificationsRead(req, res, next) {
  try {
    await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true })
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 }).limit(50)
    res.json(notifications.map(normalizeNotification))
  } catch (error) {
    next(error)
  }
}
