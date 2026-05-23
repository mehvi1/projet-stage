import { Inbox } from 'lucide-react'
import { Card } from './Card'

export function EmptyState({ title, description, action }) {
  return (
    <Card className="flex flex-col items-center justify-center py-14 text-center">
      <Inbox className="h-10 w-10 text-slate-400" />
      <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  )
}
