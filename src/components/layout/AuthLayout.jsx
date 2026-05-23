import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './ThemeSwitcher'
import { BrandLogo } from '../ui/BrandLogo'

export function AuthLayout() {
  return (
    <main className="pbx-animated-surface min-h-screen text-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(127,210,43,0.26),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="pbx-logo-glow rounded-lg bg-white px-4 py-2 shadow-lg shadow-black/20 dark:bg-slate-900">
                <BrandLogo className="w-64" />
              </div>
              <div>
                <p className="mt-3 text-sm text-slate-300">Managed IT support platform</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9be65a]">Support operations</p>
              <h1 className="mt-5 text-5xl font-black leading-tight">
                Tickets, clients, and employees in one secure command center.
              </h1>
              <p className="mt-5 text-lg text-slate-300">
                Designed for PBxcom teams that need clean intake, fast triage, traceable status updates, and printable service records.
              </p>
            </motion.div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {['JWT ready', 'MongoDB models', 'Responsive UX'].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -4, borderColor: 'rgba(127, 210, 43, 0.55)' }}
                  className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="flex min-h-screen flex-col p-4 sm:p-6">
          <div className="flex justify-between">
            <div className="lg:hidden">
              <BrandLogo className="w-44" />
            </div>
            <div className="ml-auto">
              <ThemeSwitcher />
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 items-center py-8">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}
