import nodemailer from 'nodemailer'

export function emailConfigReady(env = process.env) {
  if (env.EMAIL_PROVIDER === 'gmail') {
    return Boolean(env.SMTP_USER && env.SMTP_PASS)
  }

  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS)
}

export function createTransportOptions(env = process.env) {
  if (env.EMAIL_PROVIDER === 'gmail') {
    return {
      service: 'gmail',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    }
  }

  return {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: env.SMTP_SECURE === 'true',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  }
}

function createTransporter() {
  return nodemailer.createTransport(createTransportOptions())
}

export async function sendEmail({ to, subject, text, html }) {
  if (!to) return { skipped: true, reason: 'Missing recipient' }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER

  if (!emailConfigReady()) {
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
