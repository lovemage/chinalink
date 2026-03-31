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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
      >
        管理文章標籤
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">文章標籤管理</h2>
              <button
                type="button"
                onClick={close}
                className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
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
                  placeholder="新增通用標籤，例如：跨境電商"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isPending || !newTagName.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  新增
                </button>
              </div>

              <div className="max-h-80 overflow-auto rounded-lg border border-gray-100">
                {tags.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-400">尚無標籤</p>
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
                              className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdate(tag.id)}
                              disabled={isPending || !editingName.trim()}
                              className="rounded border border-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                            >
                              儲存
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null)
                                setEditingName('')
                              }}
                              className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-800">{tag.name}</p>
                              <p className="truncate text-xs text-gray-400">{tag.slug}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(tag.id)
                                setEditingName(tag.name)
                              }}
                              className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(tag.id, tag.name)}
                              className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
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

