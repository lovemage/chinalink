import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const lineProvider = {
  id: 'line',
  name: 'LINE',
  type: 'oidc' as const,
  issuer: 'https://access.line.me',
  clientId: process.env.AUTH_LINE_ID!,
  clientSecret: process.env.AUTH_LINE_SECRET!,
  authorization: { params: { scope: 'openid profile email' } },
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [lineProvider, Google],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user) return false

      const provider = account.provider as 'line' | 'google'
      const providerId = account.providerAccountId

      try {
        const payload = await getPayload({ config: configPromise })

        // Check if customer exists by providerId and authProvider
        const existing = await payload.find({
          collection: 'customers',
          where: {
            providerId: { equals: providerId },
            authProvider: { equals: provider },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          // Update lastLoginAt
          await payload.update({
            collection: 'customers',
            id: existing.docs[0].id,
            data: {
              lastLoginAt: new Date().toISOString(),
            },
          })
        } else {
          // Create new customer
          await payload.create({
            collection: 'customers',
            data: {
              name: user.name || '未命名用戶',
              email: user.email || `${providerId}@${provider}.oauth`,
              avatar: user.image || undefined,
              authProvider: provider,
              providerId,
              lastLoginAt: new Date().toISOString(),
            },
          })
        }
      } catch (error) {
        console.error('Error in signIn callback:', error)
        // Still allow sign in even if Payload operation fails
      }

      return true
    },

    async jwt({ token, account }) {
      if (account) {
        const provider = account.provider as 'line' | 'google'
        const providerId = account.providerAccountId

        try {
          const payload = await getPayload({ config: configPromise })
          const result = await payload.find({
            collection: 'customers',
            where: {
              providerId: { equals: providerId },
              authProvider: { equals: provider },
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
