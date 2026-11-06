'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPostTag, updatePostTag, deletePostTag } from '@/lib/actions/post-tags'

interface Tag {
  id: number
  name: string
  slug: string
}

interface Props {
  tags: Tag[]
}

export default function PostTagsManagerModal({ tags }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isPending, startTransition] = useTransition()

  const close = () => {
    if (isPending) return
    setOpen(false)
    setEditingId(null)
    setEditingName('')
  }

  const handleCreate = () => {
    if (!newTagName.trim()) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('name', newTagName)
      const res = await createPostTag(fd)
      if ('success' in res) {
        setNewTagName('')
        router.refresh()
      } else {
        alert(res.error)
      }
    })
  }

  const handleUpdate = (id: number) => {
    if (!editingName.trim()) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set('id', String(id))
      fd.set('name', editingName)
      const res = await updatePostTag(fd)
      if ('success' in res) {
        setEditingId(null)
        setEditingName('')
        router.refresh()
      } else {
        alert(res.error)
      }
    })
  }

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`確定刪除標籤「${name}」？`)) return
    startTransition(async () => {
      const res = await deletePostTag(id)
      if ('success' in res) {
        router.refresh()
      } else {
        alert(res.error)
      }
    })
  }

  // Prevent Enter key inside modal inputs from submitting a parent <form>
  const stopFormSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-2 text-sm border border-brand-rule bg-white text-brand-muted hover:bg-brand-bg transition-colors"
      >
        管理文章標籤
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onKeyDown={stopFormSubmit}
        >
          <div className="w-full max-w-xl bg-white ">
            <div className="flex items-center justify-between border-b border-brand-rule px-5 py-4">
              <h2 className="text-base font-semibold text-brand-text">文章標籤管理</h2>
              <button
                type="button"
                onClick={close}
                className="px-2 py-1 text-brand-muted hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreate()
                    }
                  }}
                  placeholder="新增通用標籤，例如：跨境電商"
                  className="flex-1 border border-brand-rule px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isPending || !newTagName.trim()}
                  className="bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-deep disabled:opacity-50"
                >
                  新增
                </button>
              </div>

              <div className="max-h-80 overflow-auto border border-brand-rule">
                {tags.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-brand-muted">尚無標籤</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {tags.map((tag) => (
                      <li key={tag.id} className="flex items-center gap-2 px-4 py-3">
                        {editingId === tag.id ? (
                          <>
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  handleUpdate(tag.id)
                                }
                              }}
                              className="flex-1 border border-brand-rule px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdate(tag.id)}
                              disabled={isPending || !editingName.trim()}
                              className="border border-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                            >
                              儲存
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null)
                                setEditingName('')
                              }}
                              className="border border-brand-rule px-2 py-1 text-xs text-brand-muted hover:bg-brand-bg"
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-brand-text">{tag.name}</p>
                              <p className="truncate text-xs text-brand-muted">{tag.slug}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(tag.id)
                                setEditingName(tag.name)
                              }}
                              className="border border-brand-rule px-2 py-1 text-xs text-brand-muted hover:bg-brand-bg"
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(tag.id, tag.name)}
                              className="border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                            >
                              刪除
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

