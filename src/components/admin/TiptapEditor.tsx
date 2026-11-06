'use client'

import { useImperativeHandle, useRef, useState, type Ref } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  Table as TableIcon,
  Minus,
} from 'lucide-react'

const ArticleImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      source: { default: null },
      decorative: { default: false },
    }
  },
})

export interface TiptapEditorHandle {
  setHtml: (html: string) => void
  getJson: () => unknown
  getText: () => string
  /** Scrolls to a quoted sentence and selects it. Returns false when it is not in the text. */
  focusQuote: (quote: string) => boolean
}

interface TiptapEditorProps {
  content?: any
  onChange?: (json: any) => void
  placeholder?: string
  handleRef?: Ref<TiptapEditorHandle>
}

export function TiptapEditor({ content, onChange, placeholder, handleRef }: TiptapEditorProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const failedFile = useRef<File | null>(null)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      ArticleImage,
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: placeholder ?? '輸入內容…',
      }),
    ],
    content: content ?? null,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  useImperativeHandle(
    handleRef,
    () => ({
      setHtml: (html) => {
        editor?.commands.setContent(html, { emitUpdate: true })
      },
      getJson: () => editor?.getJSON(),
      getText: () => editor?.getText() ?? '',
      focusQuote: (quote) => {
        if (!editor) return false
        let found: { from: number; to: number } | null = null
        editor.state.doc.descendants((node, pos) => {
          if (found) return false
          if (node.isText && node.text) {
            const index = node.text.indexOf(quote)
            if (index >= 0) found = { from: pos + index, to: pos + index + quote.length }
          }
          return true
        })
        if (!found) return false
        editor.chain().focus().setTextSelection(found).scrollIntoView().run()
        return true
      },
    }),
    [editor]
  )

  if (!editor) {
    return <div className="min-h-[16rem] border border-brand-rule bg-white" aria-busy="true" />
  }

  const handleLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('請輸入連結網址（清空可移除連結）', previous ?? 'https://')
    if (url === null) return
    if (url === '' || url === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const uploadImage = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!response.ok || !data.url) throw new Error(data.error || `上傳失敗（${response.status}）`)
      failedFile.current = null
      editor.chain().focus().setImage({ src: data.url }).run()
    } catch (error) {
      failedFile.current = file
      setUploadError(error instanceof Error ? error.message : '上傳失敗')
    } finally {
      setUploading(false)
    }
  }

  const toolbarButtons = [
    { icon: <Heading2 size={18} />, title: '大標題 H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }) },
    { icon: <Heading3 size={18} />, title: '小標題 H3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive('heading', { level: 3 }) },
    { icon: <Bold size={18} />, title: '粗體', action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
    { icon: <Italic size={18} />, title: '斜體', action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
    { icon: <List size={18} />, title: '項目清單', action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
    { icon: <ListOrdered size={18} />, title: '編號清單', action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
    { icon: <Quote size={18} />, title: '引用', action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote') },
    { icon: <LinkIcon size={18} />, title: '連結', action: handleLink, isActive: editor.isActive('link') },
    { icon: <ImageIcon size={18} />, title: '插入圖片', action: () => fileInput.current?.click(), isActive: false },
    { icon: <TableIcon size={18} />, title: '表格', action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), isActive: editor.isActive('table') },
    { icon: <Minus size={18} />, title: '分隔線', action: () => editor.chain().focus().setHorizontalRule().run(), isActive: false },
  ]

  const imageSelected = editor.isActive('image')
  const imageAttrs = editor.getAttributes('image') as {
    alt?: string
    caption?: string
    source?: string
    decorative?: boolean
  }
  const setImageAttr = (attrs: Record<string, unknown>) => {
    editor.chain().updateAttributes('image', attrs).run()
  }
  const imageField = 'w-full border border-brand-rule bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary'

  return (
    <div className="border border-brand-rule bg-white">
      <div className="sticky top-14 z-10 flex gap-0.5 overflow-x-auto border-b border-brand-rule bg-brand-raised p-1 md:top-0 md:flex-wrap">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            aria-label={btn.title}
            aria-pressed={btn.isActive}
            onClick={btn.action}
            className={`flex size-11 shrink-0 items-center justify-center text-brand-text md:size-9 ${
              btn.isActive ? 'bg-brand-tint' : 'hover:bg-brand-tint/60'
            }`}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void uploadImage(file)
          event.target.value = ''
        }}
      />

      {(uploading || uploadError) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-brand-rule px-3 py-2 text-sm" role="status">
          {uploading ? (
            <span className="text-brand-muted">圖片上傳中…</span>
          ) : (
            <>
              <span className="text-brand-alert">圖片上傳失敗：{uploadError}</span>
              <button
                type="button"
                className="underline"
                onClick={() => failedFile.current && void uploadImage(failedFile.current)}
              >
                重試
              </button>
            </>
          )}
        </div>
      )}

      {imageSelected && (
        <div className="grid gap-2 border-b border-brand-rule bg-brand-raised p-3 sm:grid-cols-3">
          <input
            className={imageField}
            placeholder="替代文字 alt（必填）"
            aria-label="圖片替代文字"
            disabled={imageAttrs.decorative}
            value={imageAttrs.alt ?? ''}
            onChange={(event) => setImageAttr({ alt: event.target.value })}
          />
          <input
            className={imageField}
            placeholder="圖說"
            aria-label="圖說"
            value={imageAttrs.caption ?? ''}
            onChange={(event) => setImageAttr({ caption: event.target.value })}
          />
          <input
            className={imageField}
            placeholder="圖片來源"
            aria-label="圖片來源"
            value={imageAttrs.source ?? ''}
            onChange={(event) => setImageAttr({ source: event.target.value })}
          />
          <label className="flex items-center gap-2 text-sm sm:col-span-3">
            <input
              type="checkbox"
              className="size-4"
              checked={Boolean(imageAttrs.decorative)}
              onChange={(event) => setImageAttr({ decorative: event.target.checked })}
            />
            裝飾圖（不需要替代文字）
          </label>
        </div>
      )}

      <EditorContent editor={editor} className="tiptap-content p-4" />
    </div>
  )
}
