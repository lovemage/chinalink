'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'

interface TiptapRendererProps {
  content: any
}

export function TiptapRenderer({ content }: TiptapRendererProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link, Table, TableRow, TableHeader, TableCell],
    content,
    editable: false,
  })

  if (!editor) return null

  return (
    <div className="prose prose-lg prose-stone max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}
