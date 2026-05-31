import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { users } from '../data/seedData'
import { api, apiMessage } from '../services/api'

function mergeDefaultUsers(savedUsers = []) {
  const defaultIds = new Set(users.map((user) => user.id))
  const defaultEmails = new Set(users.map((user) => user.email.toLowerCase()))
  const customUsers = savedUsers.filter(
    (user) => !defaultIds.has(user.id) && !defaultEmails.has(user.email.toLowerCase()),
  )
  return [...users, ...customUsers]
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: mergeDefaultUsers(users),
      user: null,
      token: null,
      login: async ({ email, password }) => {
        try {
          const { data } = await api.post('/auth/login', { email, password })
          localStorage.setItem('pbxcom-token', data.token)
          set({ user: data.user, token: data.token })
          return data.user
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Invalid email or password.'), { cause: error })
        }
        const accounts = mergeDefaultUsers(get().users)
        if (accounts.length !== get().users.length) {
          set({ users: accounts })
        }
        const found = accounts.find(
          (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
        )
        if (!found) {
          throw new Error('Invalid email or password.')
        }
        const token = `mock-jwt-${found.id}`
        localStorage.setItem('pbxcom-token', token)
        set({ user: found, token })
        return found
      },
      register: async ({ name, email, password, company }) => {
        try {
          const { data } = await api.post('/auth/register', { name, email, password, company })
          localStorage.setItem('pbxcom-token', data.token)
          set({ user: data.user, token: data.token })
          return data.user
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Registration failed.'), { cause: error })
        }
        const exists = get().users.some((user) => user.email.toLowerCase() === email.toLowerCase())
        if (exists) {
          throw new Error('This email already has an account.')
        }
        const user = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
          company,
          role: 'client',
        }
        const token = `mock-jwt-${user.id}`
        localStorage.setItem('pbxcom-token', token)
        set((state) => ({ users: [...state.users, user], user, token }))
        return user
      },
      updateProfile: async (updates) => {
        const currentUser = get().user
        if (!currentUser) {
          throw new Error('You must be logged in.')
        }

        try {
          const { data } = await api.patch('/auth/me', updates)
          set((state) => ({
            user: data,
            users: state.users.map((user) => (user.id === currentUser.id ? { ...user, ...data } : user)),
          }))
          return data
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Profile update failed.'), { cause: error })
        }

        const normalizedEmail = updates.email?.trim().toLowerCase()
        const emailExists = get().users.some(
          (user) => user.id !== currentUser.id && user.email.toLowerCase() === normalizedEmail,
        )
        if (emailExists) {
          throw new Error('This email already has an account.')
        }

        const nextUser = {
          ...currentUser,
          name: updates.name.trim(),
          email: normalizedEmail,
          company: updates.company.trim(),
          ...(updates.password ? { password: updates.password } : {}),
        }

        set((state) => ({
          user: nextUser,
          users: state.users.map((user) => (user.id === currentUser.id ? nextUser : user)),
        }))
        return nextUser
      },
      forgotPassword: async (email) => {
        try {
          const { data } = await api.post('/auth/forgot-password', { email })
          return data.message
        } catch (error) {
          if (error.response) throw new Error(apiMessage(error, 'Unable to send reset link.'), { cause: error })
          return 'Password reset instructions sent if the account exists.'
        }
      },
      resetDemoData: () => {
        localStorage.removeItem('pbxcom-auth')
        localStorage.removeItem('pbxcom-tickets')
        localStorage.removeItem('pbxcom-notifications')
        localStorage.removeItem('pbxcom-token')
        set({ users: mergeDefaultUsers(users), user: null, token: null })
      },
      logout: () => {
        localStorage.removeItem('pbxcom-token')
        set({ user: null, token: null })
      },
    }),
    {
      name: 'pbxcom-auth',
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState?.state ?? persistedState),
        users: mergeDefaultUsers(persistedState?.users ?? persistedState?.state?.users),
      }),
    },
  ),
)
