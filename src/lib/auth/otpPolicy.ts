export const OTP_RESEND_COOLDOWN_SECONDS = 60
export const OTP_DAILY_LIMIT = 3

const TAIPEI_TIMEZONE = 'Asia/Taipei'

interface EligibilityInput {
  now: Date
  lastSentAt?: string
  sentToday: number
}

type EligibilityResult =
  | { allowed: true; retryAfter: number; remainingDailyAttempts: number }
  | { allowed: false; reason: 'cooldown'; retryAfter: number }
  | { allowed: false; reason: 'daily_limit'; remainingDailyAttempts: 0 }

function getTaipeiDateParts(now: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TAIPEI_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(now)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) {
    throw new Error('Failed to resolve Taiwan local date')
  }

  return { year, month, day }
}

export function getTaipeiDayRange(now: Date) {
  const { year, month, day } = getTaipeiDateParts(now)

  const start = new Date(`${year}-${month}-${day}T00:00:00+08:00`)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 1)

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  }
}

export function getRetryAfterSeconds(lastSentAt: string, now: Date) {
  const elapsedSeconds = Math.floor((now.getTime() - new Date(lastSentAt).getTime()) / 1000)
  const remaining = OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds

  return Math.max(0, remaining)
}

export function evaluateSendOtpEligibility(input: EligibilityInput): EligibilityResult {
  if (input.sentToday >= OTP_DAILY_LIMIT) {
    return {
      allowed: false,
      reason: 'daily_limit',
      remainingDailyAttempts: 0,
    }
  }

  if (input.lastSentAt) {
    const retryAfter = getRetryAfterSeconds(input.lastSentAt, input.now)

    if (retryAfter > 0) {
      return {
        allowed: false,
        reason: 'cooldown',
        retryAfter,
      }
    }
  }

  return {
    allowed: true,
    retryAfter: OTP_RESEND_COOLDOWN_SECONDS,
    remainingDailyAttempts: Math.max(0, OTP_DAILY_LIMIT - (input.sentToday + 1)),
  }
}
