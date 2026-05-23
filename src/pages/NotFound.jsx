import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6 text-center text-slate-950 dark:bg-slate-950 dark:text-white">
      <div>
        <p className="text-sm font-bold text-cyan-600 dark:text-cyan-300">404</p>
        <h1 className="mt-2 text-4xl font-black">Page not found</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">The PBxcom workspace page you requested does not exist.</p>
        <Button as={Link} to="/login" className="mt-6">Return to login</Button>
      </div>
    </main>
  )
}
