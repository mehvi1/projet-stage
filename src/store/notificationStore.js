import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
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
      markReadForUser: (userId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.recipientId === userId ? { ...notification, read: true } : notification,
          ),
        })),
    }),
    { name: 'pbxcom-notifications' },
  ),
)
