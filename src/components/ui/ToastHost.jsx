import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

function Toast({ toast }) {
  const removeToast = useToastStore((state) => state.removeToast)

  useEffect(() => {
    const timeout = setTimeout(() => removeToast(toast.id), 3200)
    return () => clearTimeout(timeout)
  }, [removeToast, toast.id])

  const Icon = toast.type === 'error' ? CircleAlert : CircleCheck

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-white"
    >
      <Icon className={toast.type === 'error' ? 'h-5 w-5 text-rose-500' : 'h-5 w-5 text-emerald-500'} />
      {toast.message}
    </motion.div>
  )
}

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
