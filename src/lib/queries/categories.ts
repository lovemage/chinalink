'use server'

import { db } from '@/lib/db'
import { categories, serviceCategories, productCategories, productTags } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export async function getBlogCategories() {
  return db.select().from(categories).orderBy(asc(categories.name))
}

export async function getServiceCategories() {
  return db.select().from(serviceCategories).orderBy(asc(serviceCategories.name))
}

export async function getProductCategories() {
  return db.select().from(productCategories).orderBy(asc(productCategories.name))
}

export async function getProductTags() {
  return db.select().from(productTags).orderBy(asc(productTags.name))
}
