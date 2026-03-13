import test from 'node:test'
import assert from 'node:assert/strict'

import {
  OTP_DAILY_LIMIT,
  OTP_RESEND_COOLDOWN_SECONDS,
  getRetryAfterSeconds,
  getTaipeiDayRange,
  evaluateSendOtpEligibility,
} from './otpPolicy'

test('getRetryAfterSeconds returns remaining cooldown seconds', () => {
  const now = new Date('2026-03-13T03:10:00.000Z')

  assert.equal(getRetryAfterSeconds('2026-03-13T03:09:45.000Z', now), 45)
  assert.equal(getRetryAfterSeconds('2026-03-13T03:08:40.000Z', now), 0)
})

test('evaluateSendOtpEligibility blocks cooldown and daily limit', () => {
  const now = new Date('2026-03-13T03:10:00.000Z')

  const cooldownResult = evaluateSendOtpEligibility({
    now,
    lastSentAt: '2026-03-13T03:09:50.000Z',
    sentToday: 1,
  })

  assert.deepEqual(cooldownResult, {
    allowed: false,
    reason: 'cooldown',
    retryAfter: 50,
  })

  const dailyLimitResult = evaluateSendOtpEligibility({
    now,
    lastSentAt: '2026-03-13T03:00:00.000Z',
    sentToday: OTP_DAILY_LIMIT,
  })

  assert.deepEqual(dailyLimitResult, {
    allowed: false,
    reason: 'daily_limit',
    remainingDailyAttempts: 0,
  })

  const allowedResult = evaluateSendOtpEligibility({
    now,
    lastSentAt: '2026-03-13T03:00:00.000Z',
    sentToday: 1,
  })

  assert.deepEqual(allowedResult, {
    allowed: true,
    retryAfter: OTP_RESEND_COOLDOWN_SECONDS,
    remainingDailyAttempts: OTP_DAILY_LIMIT - 2,
  })
})

test('getTaipeiDayRange returns Taiwan local day boundaries', () => {
  const now = new Date('2026-03-13T16:01:00.000Z')
  const { startIso, endIso } = getTaipeiDayRange(now)

  assert.equal(startIso, '2026-03-13T16:00:00.000Z')
  assert.equal(endIso, '2026-03-14T16:00:00.000Z')
})
