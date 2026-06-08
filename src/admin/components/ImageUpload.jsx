import { useEffect, useRef, useState } from 'react'
import { uploadImage, renameImage } from '../api'
import { s, colors } from '../styles'

const MAX_BYTES = 25 * 1024 * 1024 // matches multer limit on the server

function fmtBytes(n) {
  if (n == null) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function filenameOf(url) {
  if (!url) return ''
  try {
    const parsed = url.startsWith('http') ? new URL(url).pathname : url
    return parsed.split('/').pop() || ''
  } catch {
    return url.split('/').pop() || ''
  }
}

export default function ImageUpload({ value, onChange, slug, label }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [info, setInfo] = useState(null) // last upload metadata
  const [imgFailed, setImgFailed] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [editingUrl, setEditingUrl] = useState(false)
  const [copied, setCopied] = useState(false)
  const [renaming, setRenaming] = useState(false)
  // The URL that was in effect when the user opened the URL editor.
  // We compare against this on "Done" to decide whether to rename the file on disk.
  const editStartRef = useRef(null)
  const fileInputRef = useRef(null)

  // Debounce the URL we point the <img> at so typing in the URL field
  // doesn't fire a 404 on every keystroke.
  const [previewSrc, setPreviewSrc] = useState(value || '')
  useEffect(() => {
    if (previewSrc === value) return
    const id = setTimeout(() => {
      setPreviewSrc(value || '')
      setImgFailed(false)
    }, 350)
    return () => clearTimeout(id)
  }, [value, previewSrc])

  const handleFile = async (file) => {
    if (!file) return
    if (file.size > MAX_BYTES) {
      setErr(`File too large: ${fmtBytes(file.size)}. Max is ${fmtBytes(MAX_BYTES)}.`)
      return
    }
    setBusy(true)
    setErr(null)
    setInfo({ originalName: file.name, originalSize: file.size })
    try {
      const result = await uploadImage(file, slug)
      setInfo((prev) => ({ ...prev, ...result }))
      onChange(result.url)
    } catch (e) {
      console.error('image upload failed', e)
      setErr(e.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (busy) return
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const onPick = () => {
    if (busy) return
    fileInputRef.current?.click()
  }

  const onCopy = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // ignore
    }
  }

  const toggleEditUrl = async () => {
    if (busy || renaming) return
    if (!editingUrl) {
      editStartRef.current = value || ''
      setErr(null)
      setEditingUrl(true)
      return
    }
    // Closing the editor — if both old and new are local /uploads/ paths and
    // they differ, attempt to rename the underlying file.
    const original = editStartRef.current
    const next = value || ''
    const isLocal = (u) => /^\/uploads\/[^/]+$/.test(u || '')
    if (original && isLocal(original) && isLocal(next) && original !== next) {
      setRenaming(true)
      setErr(null)
      try {
        const result = await renameImage(original, next)
        // Sync the input to whatever the server confirmed (handles trailing slashes, etc.)
        if (result?.url && result.url !== next) onChange(result.url)
        editStartRef.current = result?.url || next
        setImgFailed(false)
        setEditingUrl(false)
      } catch (e) {
        setErr(e.message || 'Rename failed')
        // Leave editor open so the user can correct.
      } finally {
        setRenaming(false)
      }
      return
    }
    editStartRef.current = next
    setEditingUrl(false)
  }

  const showImage = previewSrc && !imgFailed
  const borderColor = dragOver ? colors.primary : busy ? colors.primary : colors.border

  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!busy) setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          // Subtle bottom rule rather than a full bordered card,
          // so this doesn't read as a box-in-a-box inside form sections.
          border: dragOver ? `1px solid ${colors.primary}` : '1px solid transparent',
          borderRadius: 8,
          backgroundColor: dragOver ? colors.primarySoft : 'transparent',
          transition: 'background-color 120ms ease, border-color 120ms ease',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', gap: 14, padding: 12, alignItems: 'stretch' }}>
          {/* preview */}
          <div
            onClick={value ? undefined : onPick}
            style={{
              width: 160,
              height: 110,
              borderRadius: 6,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.panelMuted,
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
              cursor: value ? 'default' : 'pointer',
            }}
          >
            {showImage ? (
              <img
                src={previewSrc}
                alt=""
                onError={() => setImgFailed(true)}
                onLoad={() => setImgFailed(false)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <EmptyState failed={value && imgFailed} />
            )}
            {busy && <BusyOverlay />}
          </div>

          {/* meta + actions */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ minHeight: 24 }}>
              {value ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span
                    title={value}
                    style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: 13,
                      color: colors.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {filenameOf(value)}
                  </span>
                  {imgFailed && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: colors.danger,
                        backgroundColor: colors.dangerSoft,
                        padding: '1px 6px',
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    >
                      not found
                    </span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: 13, color: colors.textMuted }}>
                  Drop an image here, or click to browse.
                </span>
              )}
            </div>

            {info?.bytes && !err && (
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                {info.width}×{info.height} · {fmtBytes(info.bytes)}
                {info.originalSize && info.originalSize !== info.bytes && (
                  <> · from {fmtBytes(info.originalSize)}</>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                style={{
                  ...s.btn,
                  ...s.btnSecondary,
                  opacity: busy ? 0.6 : 1,
                  cursor: busy ? 'wait' : 'pointer',
                }}
                onClick={onPick}
                disabled={busy}
              >
                {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  e.target.value = ''
                  if (f) handleFile(f)
                }}
              />
              {value && (
                <>
                  <button
                    type="button"
                    style={{
                      ...s.btn,
                      ...s.btnGhost,
                      fontWeight: 500,
                      opacity: renaming ? 0.6 : 1,
                      cursor: renaming ? 'wait' : 'pointer',
                    }}
                    onClick={toggleEditUrl}
                    disabled={busy || renaming}
                  >
                    {renaming ? 'Renaming…' : editingUrl ? 'Done' : 'Edit URL'}
                  </button>
                  <button
                    type="button"
                    style={{ ...s.btn, ...s.btnGhost, fontWeight: 500 }}
                    onClick={onCopy}
                    disabled={busy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    style={{ ...s.btn, ...s.btnGhost, color: colors.danger, fontWeight: 500, marginLeft: 'auto' }}
                    onClick={() => {
                      onChange('')
                      setInfo(null)
                      setErr(null)
                      setEditingUrl(false)
                    }}
                    disabled={busy}
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* URL editor — only when toggled */}
        {value && editingUrl && (
          <div style={{ padding: '0 12px 12px' }}>
            <input
              type="text"
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/uploads/example.webp"
              style={{
                ...s.input,
                fontFamily: 'ui-monospace, monospace',
                fontSize: 12,
              }}
            />
            <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
              Click <strong>Done</strong> to save. If you change only the filename of a local{' '}
              <code>/uploads/…</code> path, the file on disk is renamed too. Pasting an external{' '}
              <code>https://…</code> URL is also fine.
            </div>
          </div>
        )}

        {err && (
          <div
            style={{
              margin: '0 12px 12px',
              padding: '8px 10px',
              fontSize: 12,
              color: colors.danger,
              backgroundColor: colors.dangerSoft,
              border: `1px solid ${colors.danger}`,
              borderRadius: 4,
            }}
          >
            {err}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ failed }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        color: failed ? colors.danger : colors.textMuted,
        fontSize: 11,
        textAlign: 'center',
        padding: 4,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span>{failed ? 'image not found' : 'no image'}</span>
    </div>
  )
}

function BusyOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.92)',
        gap: 6,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          border: `2.5px solid ${colors.border}`,
          borderTopColor: colors.primary,
          borderRadius: '50%',
          animation: 'imgupload-spin 0.7s linear infinite',
        }}
      />
      <span style={{ fontSize: 11, fontWeight: 600, color: colors.primary }}>uploading</span>
      <style>{`@keyframes imgupload-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
