import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import {
  BarChart3,
  Bell,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  Search,
  Settings,
  Ticket,
  Users,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './ThemeSwitcher'
import { BrandLogo } from '../ui/BrandLogo'
import { useAuthStore } from '../../store/authStore'
import { useTranslation } from '../../store/languageStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useTicketStore } from '../../store/ticketStore'
import { useToastStore } from '../../store/toastStore'
import { formatDate, initials } from '../../utils/formatters'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/tickets', label: 'Ticket management', icon: Ticket },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/employees', label: 'Employees', icon: Users },
]

function playNotificationSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  const audio = new AudioContext()
  const gain = audio.createGain()
  gain.gain.setValueAtTime(0.001, audio.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.45)
  gain.connect(audio.destination)

  ;[740, 980].forEach((frequency, index) => {
    const oscillator = audio.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    oscillator.connect(gain)
    oscillator.start(audio.currentTime + index * 0.12)
    oscillator.stop(audio.currentTime + index * 0.12 + 0.18)
  })

  setTimeout(() => audio.close(), 700)
}

function NotificationCenter({ area, user }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const notifications = useNotificationStore((state) => state.notifications)
  const markReadForUser = useNotificationStore((state) => state.markReadForUser)
  const previousUnreadRef = useRef(null)
  const userNotifications = useMemo(
    () => notifications.filter((notification) => notification.recipientId === user?.id),
    [notifications, user?.id],
  )
  const unreadCount = userNotifications.filter((notification) => !notification.read).length

  useEffect(() => {
    if (previousUnreadRef.current === null) {
      previousUnreadRef.current = unreadCount
      return
    }
    if (unreadCount > previousUnreadRef.current) {
      playNotificationSound()
    }
    previousUnreadRef.current = unreadCount
  }, [unreadCount])

  const openCenter = () => {
    setOpen((value) => !value)
    if (!open && unreadCount) markReadForUser(user.id).catch(() => {})
  }

  const openTicket = (ticketId) => {
    if (!ticketId) return
    setOpen(false)
    navigate(area === 'admin' ? `/admin/tickets/${ticketId}` : `/client/tickets/${ticketId}`)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open notifications"
        className={clsx(
          'relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#7fd22b]/60 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white',
          open ? 'border-[#7fd22b]/70 ring-4 ring-[#7fd22b]/15' : null,
        )}
        onClick={openCenter}
      >
        <Bell className="h-5 w-5" />
        {unreadCount ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#7fd22b] px-1 text-[10px] font-black text-slate-950">
            {unreadCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950"
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-white/10">
            <p className="text-sm font-black text-slate-950 dark:text-white">Notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Email alerts received on this website</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {userNotifications.length ? (
              userNotifications.slice(0, 12).map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                  onClick={() => openTicket(notification.ticketId)}
                >
                  <span className="block text-sm font-bold text-slate-950 dark:text-white">{notification.subject}</span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">{notification.message}</span>
                  <span className="mt-2 block text-xs text-slate-400">{formatDate(notification.createdAt)}</span>
                </button>
              ))
            ) : (
              <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>
            )}
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}

function Sidebar({ area, collapsed, closeMobile }) {
  const homePath = area === 'client' ? '/client' : '/admin'
  const { t } = useTranslation()
  const nav =
    area === 'client'
      ? [
          { to: '/client', label: t.ticketHistory, icon: ClipboardList, end: true },
          { to: '/client/new', label: t.newTicket, icon: FilePlus2 },
          { to: '/client/settings', label: t.settings, icon: Settings },
        ]
      : adminNav

  return (
    <aside
      className={clsx(
        'flex h-full flex-col border-r border-slate-200 bg-white/92 p-3 backdrop-blur transition-[width] duration-200 dark:border-white/10 dark:bg-slate-950/90',
        collapsed ? 'w-[76px]' : 'w-[280px]',
      )}
    >
      <div className="flex h-20 items-center px-2">
        {!collapsed ? (
          <div>
            <Link to={homePath} onClick={closeMobile} aria-label="Go to home dashboard">
              <BrandLogo className="w-52 transition-opacity hover:opacity-80" />
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">Support platform</p>
          </div>
        ) : (
          <Link to={homePath} onClick={closeMobile} aria-label="Go to home dashboard">
            <BrandLogo compact className="transition-opacity hover:opacity-80" />
          </Link>
        )}
      </div>
      {collapsed ? null : (
        <div className="px-2">
          <p className="sr-only">PBxcom support platform</p>
        </div>
      )}
      <nav className="mt-6 space-y-1">
        {nav.map(({ to, label, icon: Icon, end }, index) => (
          <NavLink
            key={`${to}-${label}`}
            to={to}
            end={end}
            onClick={closeMobile}
            className={({ isActive }) =>
              clsx(
                'group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-lg px-3 text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-slate-950 text-white shadow-lg shadow-[#7fd22b]/20 ring-1 ring-[#7fd22b]/35 dark:bg-[#7fd22b] dark:text-slate-950'
                  : 'text-slate-600 hover:bg-[#7fd22b]/12 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-[#7fd22b]/10 dark:hover:text-white',
              )
            }
          >
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {!collapsed ? <span>{label}</span> : null}
            </motion.span>
          </NavLink>
        ))}
      </nav>
      <motion.div
        initial={{ opacity: 0.88 }}
        animate={{ opacity: 1 }}
        whileHover={{ y: -3 }}
        className="mt-auto rounded-lg border border-[#7fd22b]/35 bg-[#7fd22b]/12 p-4 shadow-sm shadow-[#7fd22b]/10 dark:border-[#7fd22b]/25 dark:bg-[#7fd22b]/10"
      >
        {!collapsed ? (
          <>
            <p className="text-sm font-bold text-slate-950 dark:text-white">{area === 'client' ? t.supportTitle : 'SLA health'}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {area === 'client' ? t.supportText : '97% of tickets handled inside target.'}
            </p>
          </>
        ) : (
          <Bell className="h-5 w-5 text-[#5aa90f] dark:text-[#9be65a]" />
        )}
      </motion.div>
    </aside>
  )
}

export function DashboardLayout({ area }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminSearch, setAdminSearch] = useState('')
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const loadTickets = useTicketStore((state) => state.loadTickets)
  const loadNotifications = useNotificationStore((state) => state.loadNotifications)
  const pushToast = useToastStore((state) => state.pushToast)
  const navigate = useNavigate()

  useEffect(() => {
    loadTickets().catch((error) => pushToast(error.message, 'error'))
    loadNotifications().catch((error) => pushToast(error.message, 'error'))
  }, [loadNotifications, loadTickets, pushToast])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const submitAdminSearch = (event) => {
    event.preventDefault()
    if (!adminSearch.trim()) return
    navigate(`/admin/tickets?q=${encodeURIComponent(adminSearch.trim())}`)
  }

  return (
    <main className="pbx-animated-surface min-h-screen text-slate-950 dark:text-white">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar area={area} collapsed={collapsed} />
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/45 lg:hidden">
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} className="h-full">
            <Sidebar area={area} collapsed={false} closeMobile={() => setMobileOpen(false)} />
          </motion.div>
        </div>
      ) : null}
      <section className={clsx('min-h-screen transition-[padding-left] duration-200', collapsed ? 'lg:pl-[76px]' : 'lg:pl-[280px]')}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/65 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Collapse navigation"
              className="hidden h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 lg:grid"
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            {area === 'admin' ? (
              <form onSubmit={submitAdminSearch} className="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 md:flex">
                <Search className="h-4 w-4" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
                  value={adminSearch}
                  onChange={(event) => setAdminSearch(event.target.value)}
                  placeholder="Search tickets, clients, invoice numbers..."
                />
              </form>
            ) : (
              <div className="hidden flex-1 md:block" />
            )}
            <ThemeSwitcher />
            <NotificationCenter area={area} user={user} />
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#7fd22b] text-xs font-black text-slate-950">
                {initials(user?.name)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold">{user?.name}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user?.role}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Logout"
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </button>
            {mobileOpen ? (
              <button aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            ) : null}
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </section>
    </main>
  )
}
