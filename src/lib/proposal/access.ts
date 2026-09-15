import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

export const PROPOSAL_ACCESS_COOKIE = 'chinalink_proposal_access'
export const PROPOSAL_PATH = '/website-repositioning-survey'

function getPassword() {
  return process.env.PROPOSAL_ACCESS_PASSWORD || 'china123'
}
function getSigningSecret() {
  const secret = (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.PROPOSAL_SIGNING_SECRET
  )
  if (!secret) throw new Error('Proposal signing secret is not configured')
  return secret
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
  const expires = String(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return `${expires}.${createHmac('sha256', getSigningSecret()).update(`${expires}:${getPassword()}`).digest('hex')}`
}

export function isProposalAccessTokenValid(token?: string) {
  if (!token) return false
  const [expires, signature] = token.split('.')
  if (!signature || !/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false
  return safeEqual(signature, createHmac('sha256', getSigningSecret()).update(`${expires}:${getPassword()}`).digest('hex'))
}
