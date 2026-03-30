import { getBlogCategories, getServiceCategories, getProductCategories } from '@/lib/queries/categories'
import { CategoriesManager } from './CategoriesManager'

export default async function CategoriesPage() {
  const [blogCats, serviceCats, productCats] = await Promise.all([
    getBlogCategories(),
    getServiceCategories(),
    getProductCategories(),
  ])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">分類管理</h1>
      <CategoriesManager
        blogCategories={blogCats}
        serviceCategories={serviceCats}
        productCategories={productCats}
      />
    </div>
  )
}
