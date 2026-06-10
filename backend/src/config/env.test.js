import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { allowedOrigins } from './env.js'

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
