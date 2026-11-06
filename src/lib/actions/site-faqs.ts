'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { siteFaqs } from '@/lib/db/schema'
import { getAdminFromCookies } from '@/lib/auth-admin'

export interface SiteFaqInput {
  id?: number
  question: string
  answer: string
  relatedPostId: number | null
  status: 'published' | 'draft'
  sortOrder: number
}

type Result = { success: true } | { error: string }

function refresh() {
  revalidatePath('/admin/questions')
  revalidatePath('/questions')
  revalidatePath('/')
}

export async function saveSiteFaq(input: SiteFaqInput): Promise<Result> {
  if (!(await getAdminFromCookies())) return { error: '登入已過期，請重新登入' }
  const question = input.question.trim()
  const answer = input.answer.trim()
  if (!question || !answer) return { error: '問題與回答都要填寫' }
  const values = {
    question,
    answer,
    relatedPostId: input.relatedPostId,
    status: input.status === 'draft' ? 'draft' : 'published',
    sortOrder: input.sortOrder,
    updatedAt: new Date(),
  }
  try {
    if (input.id) {
      await db.update(siteFaqs).set(values).where(eq(siteFaqs.id, input.id))
    } else {
      await db.insert(siteFaqs).values(values)
    }
    refresh()
    return { success: true }
  } catch (error) {
    console.error('saveSiteFaq error:', error)
    return { error: '儲存失敗，請再試一次' }
  }
}

export async function deleteSiteFaq(id: number): Promise<Result> {
  if (!(await getAdminFromCookies())) return { error: '登入已過期，請重新登入' }
  try {
    await db.delete(siteFaqs).where(eq(siteFaqs.id, id))
    refresh()
    return { success: true }
  } catch (error) {
    console.error('deleteSiteFaq error:', error)
    return { error: '刪除失敗，請再試一次' }
  }
}
