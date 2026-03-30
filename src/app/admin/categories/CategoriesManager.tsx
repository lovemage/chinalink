'use client'

import { useState, useTransition, useRef } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories'

type CategoryType = 'blog' | 'service' | 'product'

interface Category {
  id: number
  name: string
  slug: string
  createdAt: Date | null
}

interface Props {
  blogCategories: Category[]
  serviceCategories: Category[]
  productCategories: Category[]
}

const TABS: { label: string; type: CategoryType }[] = [
  { label: '服務分類', type: 'service' },
  { label: '商品分類', type: 'product' },
  { label: '文章分類', type: 'blog' },
]

export function CategoriesManager({ blogCategories, serviceCategories, productCategories }: Props) {
  const [activeTab, setActiveTab] = useState<CategoryType>('service')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const addInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const getCategories = (): Category[] => {
    if (activeTab === 'service') return serviceCategories
    if (activeTab === 'product') return productCategories
    return blogCategories
  }

  const handleAdd = (formData: FormData) => {
    startTransition(async () => {
      await createCategory(activeTab, formData)
      if (addInputRef.current) addInputRef.current.value = ''
    })
  }

  const handleUpdate = (id: number, formData: FormData) => {
    startTransition(async () => {
      await updateCategory(id, activeTab, formData)
      setEditingId(null)
    })
  }

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`確定要刪除分類「${name}」？`)) return
    startTransition(async () => {
      await deleteCategory(id, activeTab)
    })
  }

  const cats = getCategories()

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.type
          return (
            <button
              key={tab.type}
              onClick={() => {
                setActiveTab(tab.type)
                setEditingId(null)
              }}
              className={[
                'px-5 py-2.5 text-sm font-medium border-b-2 transition-colors',
                isActive
                  ? 'border-[#F4845F] text-[#F4845F]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="mt-6 max-w-xl">
        {/* Add form */}
        <form
          action={handleAdd}
          className="flex gap-2 mb-6"
        >
          <input
            ref={addInputRef}
            type="text"
            name="name"
            placeholder="輸入新分類名稱"
            required
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4845F] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#F4845F] px-4 py-2 text-sm font-medium text-white hover:bg-[#e07550] disabled:opacity-50 transition-colors"
          >
            新增
          </button>
        </form>

        {/* Category list */}
        {cats.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">尚無分類</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {cats.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3 px-4 py-3">
                {editingId === cat.id ? (
                  <form
                    action={(formData) => handleUpdate(cat.id, formData)}
                    className="flex flex-1 gap-2"
                  >
                    <input
                      ref={editInputRef}
                      type="text"
                      name="name"
                      defaultValue={cat.name}
                      required
                      autoFocus
                      className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4845F]"
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="rounded bg-[#F4845F] px-3 py-1 text-xs font-medium text-white hover:bg-[#e07550] disabled:opacity-50"
                    >
                      儲存
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      取消
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{cat.name}</p>
                      <p className="text-xs text-gray-400 truncate">{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => setEditingId(cat.id)}
                      disabled={isPending}
                      className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={isPending}
                      className="rounded border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
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
  )
}
