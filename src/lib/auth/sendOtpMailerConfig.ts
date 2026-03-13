const OTP_FROM_EMAIL = 'no-reply@chinalink.tw'

export function getSendOtpMailerConfig(env: Record<string, string | undefined> = process.env) {
  const apiKey = env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  return {
    apiKey,
    fromEmail: OTP_FROM_EMAIL,
  }
}
