import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { PasswordInput } from '../../components/ui/Input'
import { api, apiMessage } from '../../services/api'
import { useToastStore } from '../../store/toastStore'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const pushToast = useToastStore((state) => state.pushToast)
  const token = searchParams.get('token') ?? ''

  const submit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await api.post('/auth/reset-password', { token, password })
      pushToast(data.message)
    } catch (error) {
      pushToast(apiMessage(error, 'Unable to reset password.'), 'error')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5"
    >
      <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Account recovery</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Choose a new password</h1>
      <PasswordInput className="mt-6" label="New password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
      <Button className="mt-6 w-full" type="submit" disabled={!token}>
        <KeyRound className="h-4 w-4" />
        Update password
      </Button>
      <Link to="/login" className="mt-4 block text-center text-sm font-semibold text-cyan-700 dark:text-cyan-300">Back to login</Link>
    </motion.form>
  )
}
