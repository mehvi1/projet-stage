import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

export function Login() {
  const [form, setForm] = useState({ email: 'client@pbxcom.ma', password: 'client123' })
  const login = useAuthStore((state) => state.login)
  const pushToast = useToastStore((state) => state.pushToast)
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    try {
      const user = login(form)
      pushToast(`Welcome back, ${user.name}.`)
      navigate(user.role === 'client' ? '/client' : '/admin')
    } catch (error) {
      pushToast(error.message, 'error')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5"
    >
      <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Secure access</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Sign in to PBxcom</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Demo: client@pbxcom.ma/client123 or admin@pbxcom.ma/admin123</p>
      <div className="mt-6 space-y-4">
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="font-semibold text-cyan-700 dark:text-cyan-300">Forgot password?</Link>
        <Link to="/register" className="font-semibold text-slate-600 dark:text-slate-300">Create account</Link>
      </div>
      <Button className="mt-6 w-full" type="submit">
        <LogIn className="h-4 w-4" />
        Login
      </Button>
    </motion.form>
  )
}
