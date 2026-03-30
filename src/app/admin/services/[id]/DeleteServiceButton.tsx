'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteService } from '@/lib/actions/services'

interface DeleteServiceButtonProps {
  serviceId: number
  serviceTitle: string
}

export default function DeleteServiceButton({
  serviceId,
  serviceTitle,
}: DeleteServiceButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteService(serviceId)
    if ('error' in result) {
      alert(result.error)
      setDeleting(false)
      setConfirming(false)
    } else {
      router.push('/admin/services')
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">確定刪除「{serviceTitle}」？</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {deleting ? '刪除中...' : '確認刪除'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="px-3 py-1.5 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
    >
      刪除服務
    </button>
  )
}
