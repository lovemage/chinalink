'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { useToast } from '@/components/admin/AdminToast'
import { deleteSiteFaq, saveSiteFaq, type SiteFaqInput } from '@/lib/actions/site-faqs'
import type { SiteFaqRow } from '@/lib/queries/site-faqs'

const input = 'w-full border border-brand-rule bg-white px-3 py-2.5 text-base outline-none focus:border-brand-primary md:text-sm'
const secondary = 'inline-flex min-h-11 items-center gap-1.5 border border-brand-rule bg-white px-3 text-sm hover:bg-brand-tint disabled:opacity-50'
const primary = 'inline-flex min-h-11 items-center gap-1.5 bg-brand-primary px-4 text-sm font-bold text-brand-raised hover:bg-brand-deep disabled:opacity-50'

type Draft = SiteFaqInput

function toDraft(row: SiteFaqRow): Draft {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    relatedPostId: row.relatedPostId,
    status: row.status === 'draft' ? 'draft' : 'published',
    sortOrder: row.sortOrder,
  }
}

function FaqEditor({
  draft,
  posts,
  onDone,
  onCancel,
}: {
  draft: Draft
  posts: { id: number; title: string }[]
  onDone: () => void
  onCancel: () => void
}) {
  const { addToast } = useToast()
  const [value, setValue] = useState(draft)
  const [pending, startTransition] = useTransition()
  return (
    <div className="space-y-2">
      <input className={input} aria-label="問題" placeholder="問題" value={value.question} onChange={(e) => setValue({ ...value, question: e.target.value })} />
      <textarea className={input} aria-label="回答" placeholder="回答" rows={5} value={value.answer} onChange={(e) => setValue({ ...value, answer: e.target.value })} />
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_6rem]">
        <select
          className={input}
          aria-label="延伸文章"
          value={value.relatedPostId ?? ''}
          onChange={(e) => setValue({ ...value, relatedPostId: e.target.value ? Number(e.target.value) : null })}
        >
          <option value="">不連結文章</option>
          {posts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>
        <select className={input} aria-label="狀態" value={value.status} onChange={(e) => setValue({ ...value, status: e.target.value as Draft['status'] })}>
          <option value="published">公開</option>
          <option value="draft">草稿</option>
        </select>
        <input className={input} aria-label="排序" type="number" inputMode="numeric" value={value.sortOrder} onChange={(e) => setValue({ ...value, sortOrder: Number(e.target.value) || 0 })} />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={primary}
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await saveSiteFaq(value)
              if ('error' in result) addToast(result.error, 'error')
              else {
                addToast('已儲存', 'success')
                onDone()
              }
            })
          }
        >
          {pending ? '儲存中…' : '儲存'}
        </button>
        <button type="button" className={secondary} onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  )
}

export default function QuestionsManager({ faqs, posts }: { faqs: SiteFaqRow[]; posts: { id: number; title: string }[] }) {
  const router = useRouter()
  const { addToast } = useToast()
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [material, setMaterial] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const nextOrder = (faqs.at(-1)?.sortOrder ?? 0) + 1

  const refresh = () => {
    setEditing(null)
    router.refresh()
  }

  async function generate() {
    if (!material.trim()) {
      setAiError('請先貼上文章或資料')
      return
    }
    setAiBusy(true)
    setAiError(null)
    try {
      const response = await fetch('/api/admin/post-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'faq', text: material }),
      })
      const data = (await response.json().catch(() => ({}))) as { faq?: { question: string; answer: string }[]; error?: string }
      if (!response.ok || !data.faq) throw new Error(data.error || '產生失敗，請再試一次')
      setDrafts(data.faq.map((item, index) => ({ ...item, relatedPostId: null, status: 'draft', sortOrder: nextOrder + index })))
    } catch (error) {
      setAiError(error instanceof Error ? error.message : '產生失敗，請再試一次')
    } finally {
      setAiBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="space-y-3 border border-brand-rule bg-brand-raised p-4">
        <h2 className="inline-flex items-center gap-2 font-bold">
          <Sparkles className="size-4 text-brand-wood" aria-hidden="true" />
          AI 產生問答草稿
        </h2>
        <textarea className={input} rows={4} aria-label="文章或資料" placeholder="貼上文章或資料，回答只會根據這些內容" value={material} onChange={(e) => setMaterial(e.target.value)} />
        <button type="button" className={primary} onClick={generate} disabled={aiBusy}>
          {aiBusy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {aiBusy ? '產生中…' : '產生草稿'}
        </button>
        {aiError && (
          <p className="text-sm text-brand-alert" role="alert">
            {aiError}
          </p>
        )}
        {drafts.map((draft, index) => (
          <div key={draft.question} className="border-t border-brand-rule pt-3">
            <FaqEditor
              draft={draft}
              posts={posts}
              onDone={() => {
                setDrafts((list) => list.filter((_, i) => i !== index))
                router.refresh()
              }}
              onCancel={() => setDrafts((list) => list.filter((_, i) => i !== index))}
            />
          </div>
        ))}
      </section>

      {editing === 'new' ? (
        <section className="border border-brand-rule bg-brand-raised p-4">
          <FaqEditor
            draft={{ question: '', answer: '', relatedPostId: null, status: 'published', sortOrder: nextOrder }}
            posts={posts}
            onDone={refresh}
            onCancel={() => setEditing(null)}
          />
        </section>
      ) : (
        <button type="button" className={secondary} onClick={() => setEditing('new')}>
          手動新增問答
        </button>
      )}

      <ul className="space-y-2">
        {faqs.map((faq) => (
          <li key={faq.id} className="border border-brand-rule bg-brand-raised p-4">
            {editing === faq.id ? (
              <FaqEditor draft={toDraft(faq)} posts={posts} onDone={refresh} onCancel={() => setEditing(null)} />
            ) : (
              <>
                <p className="font-medium leading-6">{faq.question}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-brand-muted">{faq.answer}</p>
                <p className="mt-1 text-[13px] text-brand-muted">
                  {faq.status === 'draft' ? '草稿' : '公開'}・排序 {faq.sortOrder}
                  {faq.relatedPostTitle && `・延伸：${faq.relatedPostTitle}`}
                </p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className={secondary} onClick={() => setEditing(faq.id)}>
                    編輯
                  </button>
                  <button
                    type="button"
                    className={secondary}
                    onClick={async () => {
                      if (!window.confirm('確定刪除這則問答？')) return
                      const result = await deleteSiteFaq(faq.id)
                      if ('error' in result) addToast(result.error, 'error')
                      else router.refresh()
                    }}
                  >
                    刪除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
