'use server'

import { db } from '@/lib/db'
import { categories, serviceCategories, productCategories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

type CategoryType = 'blog' | 'service' | 'product'

function getTable(type: CategoryType) {
  if (type === 'service') return serviceCategories
  if (type === 'product') return productCategories
  return categories
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '')
}

export async function createCategory(type: CategoryType, formData: FormData) {
  const name = formData.get('name') as string
  if (!name?.trim()) return

  const slug = generateSlug(name.trim())
  const table = getTable(type)

  await db.insert(table).values({ name: name.trim(), slug })
  revalidatePath('/admin/categories')
}

export async function updateCategory(
  id: number,
  type: CategoryType,
  formData: FormData
) {
  const name = formData.get('name') as string
  if (!name?.trim()) return

  const slug = generateSlug(name.trim())
  const table = getTable(type)

  await db.update(table).set({ name: name.trim(), slug }).where(eq(table.id, id))
  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: number, type: CategoryType) {
  const table = getTable(type)
  await db.delete(table).where(eq(table.id, id))
  revalidatePath('/admin/categories')
}
