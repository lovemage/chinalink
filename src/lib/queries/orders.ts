import { db } from '@/lib/db'
import { orders, customers } from '@/lib/db/schema'
import { eq, and, ilike, or, desc } from 'drizzle-orm'

interface GetOrdersOpts {
  search?: string
  orderStatus?: string
  paymentStatus?: string
}

export async function getOrders(opts: GetOrdersOpts = {}) {
  const { search, orderStatus, paymentStatus } = opts

  const conditions = []

  if (search) {
    conditions.push(
      or(
        ilike(orders.orderNumber, `%${search}%`),
        ilike(customers.name, `%${search}%`)
      )
    )
  }

  if (orderStatus) conditions.push(eq(orders.orderStatus, orderStatus))
  if (paymentStatus) conditions.push(eq(orders.paymentStatus, paymentStatus))

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: customers.name,
      amount: orders.amount,
      orderStatus: orders.orderStatus,
      paymentStatus: orders.paymentStatus,
      note: orders.note,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))

  return rows
}

export async function getOrder(id: number) {
  const result = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      customer: true,
      items: true,
      selectedAddons: true,
    },
  })
  return result ?? null
}
