const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL']

function isPlaceholder(value = '') {
  return /YOUR_|replace-with|<|>/.test(value)
}

function validateMongoUri(uri = '') {
  if (/[<>]/.test(uri)) {
    throw new Error('MONGO_URI still contains placeholder angle brackets. Replace <db_username> and remove < > around the password.')
  }

  let parsed
  try {
    parsed = new URL(uri)
  } catch {
    throw new Error('MONGO_URI must be a valid MongoDB connection string.')
  }

  if (!['mongodb:', 'mongodb+srv:'].includes(parsed.protocol)) {
    throw new Error('MONGO_URI must start with mongodb:// or mongodb+srv://.')
  }

  if (!parsed.username || ['db_username', 'your_db_user', 'your_db_username'].includes(parsed.username.toLowerCase())) {
    throw new Error('MONGO_URI must contain the real MongoDB Atlas database username.')
  }

  if (!parsed.password) {
    throw new Error('MONGO_URI must contain the real MongoDB Atlas database password.')
  }
}

export function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]?.trim())
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  validateMongoUri(process.env.MONGO_URI)

  const placeholders = requiredEnv.filter((key) => key !== 'MONGO_URI' && isPlaceholder(process.env[key]))
  if (placeholders.length) {
    throw new Error(`Replace placeholder values before starting the API: ${placeholders.join(', ')}`)
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }
}

export function allowedOrigins() {
  const configuredOrigins = [process.env.CLIENT_URL, ...(process.env.CORS_ORIGINS?.split(',') ?? [])]
    .map((origin) => origin?.trim())
    .filter(Boolean)
  const origins = new Set(configuredOrigins)

  for (const origin of configuredOrigins) {
    try {
      const url = new URL(origin)
      if (url.hostname === 'localhost') {
        url.hostname = '127.0.0.1'
        origins.add(url.toString().replace(/\/$/, ''))
      } else if (url.hostname === '127.0.0.1') {
        url.hostname = 'localhost'
        origins.add(url.toString().replace(/\/$/, ''))
      }
    } catch {
      // Ignore invalid CORS entries here; Express will reject unmatched origins.
    }
  }

  return [...origins]
}
