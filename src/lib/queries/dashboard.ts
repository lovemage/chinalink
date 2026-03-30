import { db } from '@/lib/db'
import { orders, customers, services, products } from '@/lib/db/schema'
import { count, eq, gte, desc } from 'drizzle-orm'

export async function getDashboardStats() {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalOrders,
    monthOrders,
    totalMembers,
    publishedServices,
    publishedProducts,
    recentOrders,
  ] = await Promise.all([
    db.select({ count: count() }).from(orders),
    db.select({ count: count() }).from(orders).where(gte(orders.createdAt, firstOfMonth)),
    db.select({ count: count() }).from(customers),
    db.select({ count: count() }).from(services).where(eq(services.status, 'published')),
    db.select({ count: count() }).from(products).where(eq(products.status, 'published')),
    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        amount: orders.amount,
        orderStatus: orders.orderStatus,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5),
  ])

  return {
    totalOrders: totalOrders[0].count,
    monthOrders: monthOrders[0].count,
    totalMembers: totalMembers[0].count,
    totalItems: publishedServices[0].count + publishedProducts[0].count,
    recentOrders,
  }
}
