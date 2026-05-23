import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { users } from '../data/seedData'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users,
      user: null,
      token: null,
      login: ({ email, password }) => {
        const found = get().users.find(
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
      register: ({ name, email, password, company }) => {
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
      updateProfile: (updates) => {
        const currentUser = get().user
        if (!currentUser) {
          throw new Error('You must be logged in.')
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
      logout: () => {
        localStorage.removeItem('pbxcom-token')
        set({ user: null, token: null })
      },
    }),
    { name: 'pbxcom-auth' },
  ),
)
