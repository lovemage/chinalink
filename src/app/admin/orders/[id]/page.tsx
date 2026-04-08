import { notFound } from 'next/navigation'
import { getOrder } from '@/lib/queries/orders'
import OrderDetail from './OrderDetail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const orderId = parseInt(id)
  if (isNaN(orderId)) notFound()

  const order = await getOrder(orderId)
  if (!order) notFound()

  return <OrderDetail order={order} />
}
