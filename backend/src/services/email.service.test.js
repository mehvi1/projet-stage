import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createTransportOptions, emailConfigReady } from './email.service.js'

describe('email service configuration', () => {
  it('accepts Gmail provider credentials without SMTP host and port', () => {
    const env = {
      EMAIL_PROVIDER: 'gmail',
      SMTP_USER: 'support@example.com',
      SMTP_PASS: 'app-password',
    }

    assert.equal(emailConfigReady(env), true)
    assert.deepEqual(createTransportOptions(env), {
      service: 'gmail',
      auth: {
        user: 'support@example.com',
        pass: 'app-password',
      },
    })
  })

  it('requires host and port for generic SMTP', () => {
    const incompleteEnv = {
      SMTP_USER: 'support@example.com',
      SMTP_PASS: 'smtp-password',
    }
    const completeEnv = {
      ...incompleteEnv,
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '465',
      SMTP_SECURE: 'true',
    }

    assert.equal(emailConfigReady(incompleteEnv), false)
    assert.equal(emailConfigReady(completeEnv), true)
    assert.deepEqual(createTransportOptions(completeEnv), {
      host: 'smtp.example.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@example.com',
        pass: 'smtp-password',
      },
    })
  })
})
