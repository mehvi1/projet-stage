import { Router } from 'express'
import { listNotifications, markNotificationsRead } from '../controllers/notification.controller.js'
import { requireAuth } from '../middleware/auth.js'

export const notificationRoutes = Router()

notificationRoutes.use(requireAuth)
notificationRoutes.get('/', listNotifications)
notificationRoutes.patch('/read', markNotificationsRead)
