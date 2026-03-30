import { db } from '@/lib/db'
import { customers, orders } from '@/lib/db/schema'
import { eq, ilike, or, desc } from 'drizzle-orm'

interface GetMembersOpts {
  search?: string
}

export async function getMembers(opts: GetMembersOpts = {}) {
  const { search } = opts

  const rows = await db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      authProvider: customers.authProvider,
      lastLoginAt: customers.lastLoginAt,
      createdAt: customers.createdAt,
    })
    .from(customers)
    .where(
      search
        ? or(
            ilike(customers.name, `%${search}%`),
            ilike(customers.email, `%${search}%`)
          )
        : undefined
    )
    .orderBy(desc(customers.createdAt))

  return rows
}

export async function getMember(id: number) {
  const member = await db.query.customers.findFirst({
    where: eq(customers.id, id),
  })

  if (!member) return null

  const memberOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      amount: orders.amount,
      orderStatus: orders.orderStatus,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.customerId, id))
    .orderBy(desc(orders.createdAt))
    .limit(20)

  return { ...member, orders: memberOrders }
}
