import { useState } from 'react'
import ImageUpload from './ImageUpload'
import { s, colors } from '../styles'

export default function ImageGalleryEditor({ value, onChange, slug, label }) {
  const items = Array.isArray(value) ? value : []

  const updateAt = (idx, next) => {
    const copy = items.slice()
    copy[idx] = next
    onChange(copy)
  }

  const removeAt = (idx) => {
    const copy = items.slice()
    copy.splice(idx, 1)
    onChange(copy)
  }

  const move = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= items.length) return
    const copy = items.slice()
    const [it] = copy.splice(idx, 1)
    copy.splice(target, 0, it)
    onChange(copy)
  }

  const add = () => onChange([...items, ''])

  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((it, idx) => {
          const url = typeof it === 'string' ? it : it?.src || ''
          return (
            <div
              key={idx}
              style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'flex-end' }}
            >
              <ImageUpload value={url} onChange={(next) => updateAt(idx, typeof it === 'string' ? next : { ...it, src: next })} slug={slug} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, -1)} disabled={idx === 0}>
                  ↑
                </button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px' }} onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>
                  ↓
                </button>
                <button type="button" style={{ ...s.btn, ...s.btnGhost, padding: '4px 8px', color: colors.danger }} onClick={() => removeAt(idx)}>
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <button type="button" style={{ ...s.btn, ...s.btnSecondary, marginTop: 10 }} onClick={add}>
        + Add image
      </button>
    </div>
  )
}
