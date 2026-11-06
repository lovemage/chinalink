'use client'

import { useState, useRef, useCallback } from 'react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  max?: number
  single?: boolean
}

export default function ImageUploader({
  images,
  onChange,
  max = 10,
  single = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const failedFiles = useRef<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canAddMore = single ? images.length === 0 : images.length < max

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const data: { error?: string } = await res.json().catch(() => ({}))
      throw new Error(data.error || `上傳失敗（${res.status}）`)
    }

    const data: { url: string } = await res.json()
    return data.url
  }

  async function handleFiles(files: FileList | File[]) {
    if (!canAddMore) return

    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (fileArray.length === 0) return

    // Respect max / single constraints
    const remaining = single ? 1 : max - images.length
    const toUpload = fileArray.slice(0, remaining)

    setUploading(true)
    setUploadError(null)
    try {
      const urls = await Promise.all(toUpload.map(uploadFile))
      const validUrls = urls.filter((u): u is string => u !== null)
      if (single) {
        onChange(validUrls.slice(0, 1))
      } else {
        onChange([...images, ...validUrls])
      }
      failedFiles.current = []
    } catch (err) {
      failedFiles.current = toUpload
      setUploadError(err instanceof Error ? err.message : '上傳失敗，請稍後再試')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function removeImage(index: number) {
    const next = [...images]
    next.splice(index, 1)
    onChange(next)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, max, single]
  )

  return (
    <div>
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative group aspect-square overflow-hidden bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 size-9 bg-brand-text/80 text-white text-lg flex items-center justify-center"
                aria-label="移除圖片"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button — only shown when more images can be added */}
      {canAddMore && (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            'w-full min-h-[80px] border-2 border-dashed ',
            'flex flex-col items-center justify-center gap-1',
            'text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            dragging
              ? 'border-brand-cta text-brand-cta bg-brand-cta/5'
              : 'border-brand-rule text-brand-muted hover:border-brand-cta hover:text-brand-cta',
          ].join(' ')}
        >
          {uploading ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>上傳中...</span>
            </>
          ) : (
            <>
              <span className="text-xl leading-none">+</span>
              <span>
                {dragging
                  ? '放開以上傳'
                  : single
                    ? '上傳圖片'
                    : `上傳圖片（${images.length}/${max}）`}
              </span>
            </>
          )}
        </button>
      )}

      {uploadError && (
        <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-brand-alert" role="alert">
          圖片上傳失敗：{uploadError}
          <button
            type="button"
            className="text-brand-text underline"
            onClick={() => handleFiles(failedFiles.current)}
          >
            重試
          </button>
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={!single}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files)
          }
        }}
      />
    </div>
  )
}
