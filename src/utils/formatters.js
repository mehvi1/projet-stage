export function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function initials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function statusTone(status) {
  const tones = {
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200',
    Seen: 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200',
    'In Progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200',
    Resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200',
    Closed: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  }
  return tones[status] ?? tones.Pending
}
