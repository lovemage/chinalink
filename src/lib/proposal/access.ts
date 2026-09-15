import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

export const PROPOSAL_ACCESS_COOKIE = 'chinalink_proposal_access'
export const PROPOSAL_PATH = '/website-repositioning-survey'

function getPassword() {
  return process.env.PROPOSAL_ACCESS_PASSWORD || 'china123'
}
function getSigningSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'chinalink-proposal-access-v1'
  )
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  )
}

export function isProposalPasswordValid(password: string) {
  return safeEqual(password, getPassword())
}

export function getProposalAccessToken() {
  return createHmac('sha256', getSigningSecret())
    .update(`proposal-access:${getPassword()}`)
    .digest('hex')
}

export function isProposalAccessTokenValid(token?: string) {
  return typeof token === 'string' && safeEqual(token, getProposalAccessToken())
}
