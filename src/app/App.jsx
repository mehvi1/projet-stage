import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthLayout } from '../components/layout/AuthLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { ToastHost } from '../components/ui/ToastHost'
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'
import { ForgotPassword } from '../pages/auth/ForgotPassword'
import { ClientDashboard } from '../pages/client/ClientDashboard'
import { ClientSettings } from '../pages/client/ClientSettings'
import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminAnalytics } from '../pages/admin/AdminAnalytics'
import { AdminTickets } from '../pages/admin/AdminTickets'
import { AdminTicketDetail } from '../pages/admin/AdminTicketDetail'
import { NotFound } from '../pages/NotFound'
import { useLanguageBootstrap } from '../store/languageStore'
import { useThemeBootstrap } from '../store/themeStore'

export function App() {
  useThemeBootstrap()
  useLanguageBootstrap()

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route
            path="/client"
            element={
              <ProtectedRoute roles={['client']}>
                <DashboardLayout area="client" />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route path="settings" element={<ClientSettings />} />
            <Route path="tickets/*" element={<Navigate to="/client" replace />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'employee']}>
                <DashboardLayout area="admin" />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="tickets/:ticketId" element={<AdminTicketDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <ToastHost />
    </Router>
  )
}
