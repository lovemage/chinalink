'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
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

interface TiptapEditorProps {
  content?: any
  onChange?: (json: any) => void
  placeholder?: string
}

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: placeholder ?? 'Start writing...',
      }),
    ],
    content: content ?? null,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  if (!editor) return null

  const handleLink = () => {
    const url = window.prompt('Enter URL:')
    if (!url) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  const handleImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const toolbarButtons = [
    {
      icon: <Bold size={16} />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: <Italic size={16} />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: <Heading2 size={16} />,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 size={16} />,
      title: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <List size={16} />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered size={16} />,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: <Quote size={16} />,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: <LinkIcon size={16} />,
      title: 'Link',
      action: handleLink,
      isActive: editor.isActive('link'),
    },
    {
      icon: <ImageIcon size={16} />,
      title: 'Image',
      action: handleImage,
      isActive: false,
    },
    {
      icon: <TableIcon size={16} />,
      title: 'Table',
      action: handleTable,
      isActive: editor.isActive('table'),
    },
    {
      icon: <Minus size={16} />,
      title: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
    },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            onClick={btn.action}
            className={`p-1.5 rounded hover:bg-gray-200 text-gray-600 ${
              btn.isActive ? 'bg-gray-200 text-gray-900' : ''
            }`}
          >
            {btn.icon}
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  )
}
