import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { users } from '../data/seedData'

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
      login: ({ email, password }) => {
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
