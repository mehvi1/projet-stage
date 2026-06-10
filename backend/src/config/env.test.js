import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { allowedOrigins, validateEnv } from './env.js'

const originalEnv = { ...process.env }

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('allowedOrigins', () => {
  it('allows localhost and 127.0.0.1 variants for local development', () => {
    process.env.CLIENT_URL = 'http://localhost:5173'
    delete process.env.CORS_ORIGINS

    assert.deepEqual(allowedOrigins(), [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ])
  })

  it('keeps explicitly configured origins', () => {
    process.env.CLIENT_URL = 'https://app.example.com'
    process.env.CORS_ORIGINS = 'http://127.0.0.1:5173, https://admin.example.com'

    assert.deepEqual(allowedOrigins(), [
      'https://app.example.com',
      'http://127.0.0.1:5173',
      'https://admin.example.com',
      'http://localhost:5173',
    ])
  })
})

describe('validateEnv', () => {
  function setValidEnv(overrides = {}) {
    process.env.MONGO_URI = 'mongodb+srv://real_user:real_password@example.mongodb.net/pbxcom'
    process.env.JWT_SECRET = 'a'.repeat(32)
    process.env.CLIENT_URL = 'http://localhost:5173'
    Object.assign(process.env, overrides)
  }

  it('explains MongoDB angle bracket placeholders', () => {
    setValidEnv({
      MONGO_URI: 'mongodb+srv://<db_username>:<password>@example.mongodb.net/pbxcom',
    })

    assert.throws(
      () => validateEnv(),
      /MONGO_URI still contains placeholder angle brackets/,
    )
  })

  it('rejects placeholder database usernames even without angle brackets', () => {
    setValidEnv({
      MONGO_URI: 'mongodb+srv://db_username:real_password@example.mongodb.net/pbxcom',
    })

    assert.throws(
      () => validateEnv(),
      /real MongoDB Atlas database username/,
    )
  })

  it('accepts a complete MongoDB connection string', () => {
    setValidEnv()

    assert.doesNotThrow(() => validateEnv())
  })
})
