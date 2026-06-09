import nodemailer from 'nodemailer'

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function createTransporter() {
  if (process.env.EMAIL_PROVIDER === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendEmail({ to, subject, text, html }) {
  if (!to) return { skipped: true, reason: 'Missing recipient' }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER

  if (!smtpReady()) {
    console.log('Email not sent because SMTP is not configured:', { to, subject, text })
    return { skipped: true, reason: 'SMTP not configured' }
  }

  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })
    return { sent: true, messageId: info.messageId, accepted: info.accepted, rejected: info.rejected }
  } catch (error) {
    console.error('Email failed:', { to, subject, error: error.message })
    return { failed: true, reason: error.message }
  }
}

export async function sendEmails(messages) {
  const results = await Promise.all(messages.map((message) => sendEmail(message)))
  return {
    sent: results.filter((result) => result.sent).length,
    skipped: results.filter((result) => result.skipped).length,
    failed: results.filter((result) => result.failed).length,
    results,
  }
}

export function appUrl(path = '') {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  return `${baseUrl}${path}`
}
