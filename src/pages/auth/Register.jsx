import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

export function Register() {
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' })
  const register = useAuthStore((state) => state.register)
  const pushToast = useToastStore((state) => state.pushToast)
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    try {
      register(form)
      pushToast('Your client workspace is ready.')
      navigate('/client')
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
      <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Client onboarding</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Create your account</h1>
      <div className="mt-6 space-y-4">
        <Input label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input label="Company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="Password" type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
      </div>
      <Button className="mt-6 w-full" type="submit">
        <UserPlus className="h-4 w-4" />
        Register
      </Button>
      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Already registered? <Link to="/login" className="font-semibold text-cyan-700 dark:text-cyan-300">Login</Link>
      </p>
    </motion.form>
  )
}
