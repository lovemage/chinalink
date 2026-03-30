import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { verificationCodes, customers } from '@/lib/db/schema'
import { eq, and, gte } from 'drizzle-orm'

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

        // 1. Verify latest code only
        const latestCodes = await db
          .select()
          .from(verificationCodes)
          .where(eq(verificationCodes.email, email))
          .orderBy(verificationCodes.createdAt)
          .limit(1)

        const latestCode = latestCodes[0]
        const isCodeValid =
          !!latestCode &&
          latestCode.code === code &&
          new Date(latestCode.expiresAt).getTime() > Date.now()

        if (!isCodeValid) {
          throw new Error('Invalid or expired verification code')
        }

        // Mark used code as expired to keep daily send history and prevent reuse.
        await db
          .update(verificationCodes)
          .set({ expiresAt: new Date() })
          .where(eq(verificationCodes.id, latestCode.id))

        // 2. Find or create user
        const existingCustomers = await db
          .select()
          .from(customers)
          .where(
            and(
              eq(customers.email, email),
              eq(customers.authProvider, 'email'),
            ),
          )
          .limit(1)

        if (existingCustomers.length > 0) {
          const user = existingCustomers[0]
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
        const existing = await db
          .select()
          .from(customers)
          .where(
            and(
              eq(customers.providerId, providerId),
              eq(customers.authProvider, actualProvider),
            ),
          )
          .limit(1)

        if (existing.length > 0) {
          await db
            .update(customers)
            .set({ lastLoginAt: new Date() })
            .where(eq(customers.id, existing[0].id))
          user.id = existing[0].id.toString()
        } else {
          const [newUser] = await db
            .insert(customers)
            .values({
              name: user.name || '未命名用戶',
              email: user.email || `${providerId}@${actualProvider}.oauth`,
              avatar: user.image || undefined,
              authProvider: actualProvider,
              providerId,
              lastLoginAt: new Date(),
            })
            .returning()
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
          const result = await db
            .select()
            .from(customers)
            .where(
              and(
                eq(customers.providerId, providerId),
                eq(customers.authProvider, actualProvider),
              ),
            )
            .limit(1)

          if (result.length > 0) {
            token.customerId = result[0].id
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
        ;(session as any).customerId = token.customerId
      }
      return session
    },
  },
}
