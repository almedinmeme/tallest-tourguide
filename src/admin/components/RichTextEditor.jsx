import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useEffect, useRef } from 'react'
import { uploadImage } from '../api'
import { colors } from '../styles'

const toolbarBtn = (active) => ({
  appearance: 'none',
  border: '1px solid ' + (active ? colors.primary : colors.border),
  backgroundColor: active ? '#e0f2fe' : '#fff',
  color: active ? colors.primaryHover : colors.text,
  padding: '4px 10px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
})

export default function RichTextEditor({ value, onChange, slug }) {
  const lastEmittedRef = useRef(value)

  const editor = useEditor({
    extensions: [
      // StarterKit ships its own Link in v3 — disable it here so we can use our configured one.
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener', target: '_blank' } }),
      Image,
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      const html = ed.isEmpty ? '' : ed.getHTML()
      lastEmittedRef.current = html
      onChange(html)
    },
  })

  // Keep editor in sync if parent swaps value (e.g. after server load)
  useEffect(() => {
    if (!editor) return
    if (value === lastEmittedRef.current) return
    editor.commands.setContent(value || '', { emitUpdate: false })
    lastEmittedRef.current = value
  }, [value, editor])

  if (!editor) return null

  const isActive = (name, attrs) => editor.isActive(name, attrs)

  const promptLink = () => {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const { url } = await uploadImage(file, slug)
        editor.chain().focus().setImage({ src: url }).run()
      } catch (err) {
        alert('Image upload failed: ' + err.message)
      }
    }
    input.click()
  }

  return (
    <div style={{ border: `1px solid ${colors.borderStrong}`, borderRadius: 6, backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 6, borderBottom: `1px solid ${colors.border}` }}>
        <button type="button" style={toolbarBtn(isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" style={{ ...toolbarBtn(isActive('italic')), fontStyle: 'italic' }} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" style={toolbarBtn(isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" style={toolbarBtn(isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" style={toolbarBtn(isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" style={toolbarBtn(isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" style={toolbarBtn(isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>" Quote</button>
        <button type="button" style={toolbarBtn(isActive('link'))} onClick={promptLink}>Link</button>
        <button type="button" style={toolbarBtn(false)} onClick={insertImage}>+ Image</button>
        <button type="button" style={toolbarBtn(false)} onClick={() => editor.chain().focus().undo().run()}>↶</button>
        <button type="button" style={toolbarBtn(false)} onClick={() => editor.chain().focus().redo().run()}>↷</button>
      </div>
      <EditorContent editor={editor} className="admin-rte" />
      <style>{`
        .admin-rte .ProseMirror {
          padding: 12px 14px;
          min-height: 140px;
          outline: none;
          font-size: 14px;
          line-height: 1.6;
        }
        .admin-rte .ProseMirror p { margin: 0 0 8px; }
        .admin-rte .ProseMirror h2 { font-size: 18px; margin: 12px 0 6px; font-weight: 700; }
        .admin-rte .ProseMirror h3 { font-size: 16px; margin: 10px 0 6px; font-weight: 700; }
        .admin-rte .ProseMirror ul, .admin-rte .ProseMirror ol { padding-left: 20px; margin: 0 0 8px; }
        .admin-rte .ProseMirror img { max-width: 100%; height: auto; border-radius: 4px; }
        .admin-rte .ProseMirror a { color: ${colors.primary}; text-decoration: underline; }
        .admin-rte .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: ${colors.textMuted};
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
