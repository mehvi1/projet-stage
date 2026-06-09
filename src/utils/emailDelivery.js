export function emailDeliveryMessage(ticket, successMessage) {
  if (!ticket?.apiId) {
    return {
      message: 'Saved locally only. Start the backend API and fix MongoDB/SMTP settings to send real email.',
      tone: 'error',
    }
  }

  const delivery = ticket.emailNotification
  if (!delivery) {
    return { message: successMessage, tone: 'success' }
  }

  const sentCount = delivery.sent === true ? 1 : Number(delivery.sent ?? 0)
  const failedCount = delivery.failed === true ? 1 : Number(delivery.failed ?? 0)
  const skippedCount = delivery.skipped === true ? 1 : Number(delivery.skipped ?? 0)
  const sent = sentCount ? `${sentCount} email${sentCount > 1 ? 's' : ''}` : 'Email'
  if (sentCount > 0 && !failedCount) {
    return { message: `${sent} sent successfully.`, tone: 'success' }
  }

  const firstProblem = delivery.reason ?? delivery.results?.find((result) => result.reason)?.reason
  if (skippedCount || failedCount) {
    return {
      message: `Ticket saved, but email was not sent${firstProblem ? `: ${firstProblem}` : '.'}`,
      tone: 'error',
    }
  }

  return { message: successMessage, tone: 'success' }
}
