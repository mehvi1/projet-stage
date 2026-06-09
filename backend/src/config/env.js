const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL']

function isPlaceholder(value = '') {
  return /YOUR_|replace-with|<|>/.test(value)
}

export function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]?.trim())
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  const placeholders = requiredEnv.filter((key) => isPlaceholder(process.env[key]))
  if (placeholders.length) {
    throw new Error(`Replace placeholder values before starting the API: ${placeholders.join(', ')}`)
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }
}

export function allowedOrigins() {
  return [process.env.CLIENT_URL, ...(process.env.CORS_ORIGINS?.split(',') ?? [])]
    .map((origin) => origin?.trim())
    .filter(Boolean)
}
