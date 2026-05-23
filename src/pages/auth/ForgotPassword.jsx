import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { MailCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToastStore } from '../../store/toastStore'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const pushToast = useToastStore((state) => state.pushToast)

  const submit = (event) => {
    event.preventDefault()
    pushToast('Password reset instructions sent if the account exists.')
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5"
    >
      <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Account recovery</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Reset password</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter your email and PBxcom will send a secure recovery link.</p>
      <Input className="mt-6" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Button className="mt-6 w-full" type="submit">
        <MailCheck className="h-4 w-4" />
        Send reset link
      </Button>
      <Link to="/login" className="mt-4 block text-center text-sm font-semibold text-cyan-700 dark:text-cyan-300">Back to login</Link>
    </motion.form>
  )
}
