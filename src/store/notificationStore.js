import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, apiMessage, localDemoEnabled } from '../services/api'

function normalizeNotification(notification) {
  return {
    ...notification,
    id: notification.id ?? notification._id,
    recipientId: notification.recipientId ?? notification.recipient?._id ?? notification.recipient,
    ticketId: notification.ticketId ?? notification.ticketPublicId,
    createdAt: notification.createdAt ?? new Date().toISOString(),
  }
}

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      loadNotifications: async () => {
        try {
          const { data } = await api.get('/notifications')
          const normalized = data.map(normalizeNotification)
          set({ notifications: normalized })
          return normalized
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to load notifications.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Notifications cannot synchronize without the backend API.', { cause: error })
          return get().notifications
        }
      },
      sendEmailNotification: ({ recipientId, recipientEmail, recipientRole, subject, message, ticketId }) => {
        const notification = {
          id: crypto.randomUUID(),
          recipientId,
          recipientEmail,
          recipientRole,
          subject,
          message,
          ticketId,
          channel: 'email',
          read: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ notifications: [notification, ...state.notifications] }))
        return notification
      },
      markReadForUser: async (userId) => {
        try {
          const { data } = await api.patch('/notifications/read')
          set({ notifications: data.map(normalizeNotification) })
          return
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to mark notifications as read.'), { cause: error })
          if (!localDemoEnabled()) throw new Error('Server unavailable. Notifications cannot synchronize without the backend API.', { cause: error })
        }
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.recipientId === userId ? { ...notification, read: true } : notification,
          ),
        }))
      },
    }),
    { name: 'pbxcom-notifications' },
  ),
)
