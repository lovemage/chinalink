import { getAllSiteFaqs } from '@/lib/queries/site-faqs'
import { getPublishedPostRefs } from '@/lib/queries/posts'
import QuestionsManager from './QuestionsManager'

export default async function AdminQuestionsPage() {
  const [faqs, posts] = await Promise.all([getAllSiteFaqs(), getPublishedPostRefs()])
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <h1 className="text-xl font-bold text-brand-text md:text-2xl">問題與交流</h1>
      <QuestionsManager faqs={faqs} posts={posts.map(({ id, title }) => ({ id, title }))} />
    </div>
  )
}
