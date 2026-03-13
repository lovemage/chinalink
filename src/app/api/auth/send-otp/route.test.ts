import test from 'node:test'
import assert from 'node:assert/strict'

import { getSendOtpMailerConfig } from '@/lib/auth/sendOtpMailerConfig'

test('getSendOtpMailerConfig throws when RESEND_API_KEY is missing', () => {
  assert.throws(
    () => getSendOtpMailerConfig({ RESEND_FROM_EMAIL: 'noreply@example.com' }),
    /RESEND_API_KEY is not configured/
  )
})

test('getSendOtpMailerConfig always uses Resend default sender and ignores RESEND_FROM_EMAIL', () => {
  const config = getSendOtpMailerConfig({ RESEND_API_KEY: 're_test_key' })
  const configWithFromEnv = getSendOtpMailerConfig({
    RESEND_API_KEY: 're_test_key',
    RESEND_FROM_EMAIL: 'custom@example.com',
  })

  assert.equal(config.apiKey, 're_test_key')
  assert.equal(config.fromEmail, 'no-reply@chinalink.tw')
  assert.equal(configWithFromEnv.fromEmail, 'no-reply@chinalink.tw')
})
