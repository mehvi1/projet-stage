import { formatDate } from '../../utils/formatters'

export function PrintableTicket({ ticket }) {
  return (
    <div className="print-area rounded-lg border border-slate-200 bg-white p-6 text-slate-950 dark:border-white/10 dark:bg-slate-900 dark:text-white">
      <div className="flex items-start justify-between border-b border-slate-200 pb-5 dark:border-white/10">
        <div>
          <p className="text-2xl font-black">PBxcom</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Professional IT Support Ticket</p>
        </div>
        <div className="text-right">
          <p className="font-black">{ticket.id}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(ticket.createdAt)}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section>
          <h3 className="text-sm font-black uppercase text-slate-500 dark:text-slate-400">Client information</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            {Object.entries(ticket.client).map(([key, value]) => (
              <div key={key}>
                <dt className="capitalize text-slate-500 dark:text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h3 className="text-sm font-black uppercase text-slate-500 dark:text-slate-400">Ticket details</h3>
          <div className="mt-3 space-y-3 text-sm">
            <p>
              <span className="text-slate-500 dark:text-slate-400">Status:</span> <strong>{ticket.status}</strong>
            </p>
            <p>
              <span className="text-slate-500 dark:text-slate-400">Priority:</span> <strong>{ticket.priority}</strong>
            </p>
            <p>
              <span className="text-slate-500 dark:text-slate-400">Subject:</span> <strong>{ticket.subject}</strong>
            </p>
          </div>
        </section>
      </div>
      <section className="mt-6">
        <h3 className="text-sm font-black uppercase text-slate-500 dark:text-slate-400">Problem description</h3>
        <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm dark:bg-white/5">{ticket.description}</p>
      </section>
    </div>
  )
}
