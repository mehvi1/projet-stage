export function formatTicketNumber(value) {
  return String(value).padStart(5, '0')
}

export function ticketNumberValue(ticket) {
  const value = ticket?.ticketNumber ?? ticket?.id ?? ticket?.publicId ?? ''
  const match = String(value).match(/\d+/)
  return match ? Number(match[0]) : 0
}

export function nextTicketNumber(tickets) {
  const highest = tickets.reduce((max, ticket) => {
    const value = String(ticket?.ticketNumber ?? ticket?.id ?? '')
    if (!/^\d+$/.test(value)) return max
    return Math.max(max, Number(value))
  }, 0)
  return formatTicketNumber(highest + 1)
}

export function sortTicketsByNumber(tickets) {
  return [...tickets].sort((first, second) => ticketNumberValue(first) - ticketNumberValue(second))
}
