import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/queries/products'
import { getProductCategories, getProductTags } from '@/lib/queries/categories'
import ProductForm from '@/components/admin/ProductForm'
import DeleteProductButton from './DeleteProductButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const productId = parseInt(id)

  if (isNaN(productId)) notFound()

  const [product, categories, tags] = await Promise.all([
    getProduct(productId),
    getProductCategories(),
    getProductTags(),
  ])

  if (!product) notFound()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回產品管理
        </Link>
        <DeleteProductButton productId={productId} productTitle={product.title} />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">編輯產品：{product.title}</h1>

      <ProductForm
        product={product}
        categories={categories}
        tags={tags}
        mode="edit"
      />
    </div>
  )
}
