import nodemailer from 'nodemailer'

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function createTransporter() {
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

  const transporter = createTransporter()
  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}

export function appUrl(path = '') {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  return `${baseUrl}${path}`
}
