import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Google,
    Credentials({
      id: 'email-otp',
      name: 'Email OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null

        const email = String(credentials.email).trim().toLowerCase()
        const code = String(credentials.code).trim()

        const payload = await getPayload({ config: configPromise })

        // 1. Verify latest code only
        const latestCodes = await payload.find({
          collection: 'verification-codes',
          where: {
            email: { equals: email },
          },
          sort: '-createdAt',
          limit: 1,
        })

        const latestCode = latestCodes.docs[0]
        const isCodeValid =
          !!latestCode &&
          latestCode.code === code &&
          new Date(latestCode.expiresAt).getTime() > Date.now()

        if (!isCodeValid) {
          throw new Error('Invalid or expired verification code')
        }

        // Mark used code as expired to keep daily send history and prevent reuse.
        await payload.update({
          collection: 'verification-codes',
          id: latestCode.id,
          data: {
            expiresAt: new Date().toISOString(),
          },
        })

        // 2. Find or create user
        const customers = await payload.find({
          collection: 'customers',
          where: {
            email: { equals: email },
            authProvider: { equals: 'email' },
          },
          limit: 1,
        })

        if (customers.docs.length > 0) {
          const user = customers.docs[0]
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          }
        }

        // Return user to be created in signIn callback
        return {
          id: email, // Temporary ID, NextAuth callback will handle it
          email,
          name: email.split('@')[0],
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user) return false

      const provider = account.provider as 'email-otp' | 'google'
      const providerId = provider === 'email-otp' ? user.email! : account.providerAccountId
      const actualProvider = provider === 'email-otp' ? 'email' : provider

      try {
        const payload = await getPayload({ config: configPromise })

        const existing = await payload.find({
          collection: 'customers',
          where: {
            providerId: { equals: providerId },
            authProvider: { equals: actualProvider },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: 'customers',
            id: existing.docs[0].id,
            data: {
              lastLoginAt: new Date().toISOString(),
            },
          })
          user.id = existing.docs[0].id.toString()
        } else {
          const newUser = await payload.create({
            collection: 'customers',
            data: {
              name: user.name || '未命名用戶',
              email: user.email || `${providerId}@${actualProvider}.oauth`,
              avatar: user.image || undefined,
              authProvider: actualProvider,
              providerId,
              lastLoginAt: new Date().toISOString(),
            },
          })
          user.id = newUser.id.toString()
        }
      } catch (error) {
        console.error('Error in signIn callback:', error)
      }

      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.customerId = user.id
      } else if (account) {
        const provider = account.provider as 'email-otp' | 'google'
        const providerId = account.providerAccountId
        const actualProvider = provider === 'email-otp' ? 'email' : provider

        try {
          const payload = await getPayload({ config: configPromise })
          const result = await payload.find({
            collection: 'customers',
            where: {
              providerId: { equals: providerId },
              authProvider: { equals: actualProvider },
            },
            limit: 1,
          })

          if (result.docs.length > 0) {
            token.customerId = result.docs[0].id
          }
        } catch (error) {
          console.error('Error in jwt callback:', error)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token.customerId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).customerId = token.customerId
      }
      return session
    },
  },
}
