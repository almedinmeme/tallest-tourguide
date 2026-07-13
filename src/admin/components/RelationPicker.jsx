// Searchable dropdown for referencing tours/packages by slug — replaces
// hand-typed slug inputs. Stores bare slug strings (single) or arrays of
// them (multiple), exactly like the old free-text fields, so data shape is
// unchanged. Unresolvable stored slugs surface as red warning chips instead
// of failing silently on the public site.
import { useEffect, useMemo, useRef, useState } from 'react'
import { s, colors } from '../styles'
import { useCollectionOptions } from '../hooks/useCollectionOptions'

const KIND_LABEL = { tour: 'tour', package: 'package', journal: 'journal post' }

export default function RelationPicker({
  kind,
  value,
  onChange,
  multiple = false,
  allowEmpty = true,
  placeholder,
  onPick,
}) {
  const { options, loading, error } = useCollectionOptions(kind)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)
  const searchRef = useRef(null)

  const selected = useMemo(
    () => (multiple ? (Array.isArray(value) ? value : []) : value || ''),
    [multiple, value],
  )

  useEffect(() => {
    if (!open) return
    searchRef.current?.focus()
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const byPickState = useMemo(() => {
    const taken = new Set(multiple ? selected : [])
    const q = query.trim().toLowerCase()
    return options.filter(
      (o) =>
        !taken.has(o.slug) &&
        (!q || o.label.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q)),
    )
  }, [options, query, selected, multiple])

  const resolve = (slug) => options.find((o) => o.slug === slug)

  const pick = (option) => {
    if (multiple) {
      onChange([...selected, option.slug])
    } else {
      onChange(option.slug)
      setOpen(false)
    }
    setQuery('')
    onPick?.(option)
  }

  const removeSlug = (slug) => {
    if (multiple) onChange(selected.filter((v) => v !== slug))
    else onChange('')
  }

  const chips = multiple ? selected : selected ? [selected] : []

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      {chips.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          {chips.map((slug) => {
            const option = resolve(slug)
            const missing = !loading && !error && !option
            return (
              <div
                key={slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 8px',
                  border: `1px solid ${missing ? colors.danger : colors.border}`,
                  borderRadius: 8,
                  backgroundColor: missing ? colors.dangerSoft : colors.panelMuted,
                }}
              >
                {option?.image ? (
                  <img
                    src={option.image}
                    alt=""
                    style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 5, flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 28,
                      borderRadius: 5,
                      backgroundColor: missing ? 'transparent' : colors.panelHover,
                      border: `1px solid ${missing ? colors.danger : colors.border}`,
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: missing ? colors.danger : colors.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {missing ? `Unknown ${KIND_LABEL[kind] || 'item'}` : option ? option.label : '…'}
                  </div>
                  <code style={{ fontSize: 11, color: missing ? colors.danger : colors.textMuted, fontFamily: 'ui-monospace, monospace' }}>
                    {slug}
                    {missing ? ' — not found, links will not show on the site' : ''}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => removeSlug(slug)}
                  title="Remove"
                  style={{
                    ...s.btn,
                    ...s.btnGhost,
                    padding: '4px 9px',
                    color: colors.textMuted,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}

      {(multiple || chips.length === 0) && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            ...s.btn,
            ...s.btnGhost,
            width: multiple ? undefined : '100%',
            justifyContent: multiple ? undefined : 'space-between',
            color: colors.textSubtle,
            fontWeight: 500,
            backgroundColor: '#fff',
            border: `1px solid ${colors.borderStrong}`,
          }}
        >
          <span>{placeholder || `Choose a ${KIND_LABEL[kind] || 'item'}…`}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: multiple ? undefined : 0,
            minWidth: 320,
            marginTop: 6,
            zIndex: 40,
            backgroundColor: colors.panel,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(20,28,24,0.08), 0 16px 40px rgba(20,28,24,0.12)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: 8, borderBottom: `1px solid ${colors.border}` }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${KIND_LABEL[kind] || ''}s…`}
              style={{ ...s.input, padding: '7px 10px' }}
            />
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {!multiple && allowEmpty && selected && (
              <OptionRow
                onClick={() => {
                  onChange('')
                  setOpen(false)
                  setQuery('')
                }}
              >
                <span style={{ color: colors.textMuted, fontStyle: 'italic', fontSize: 13 }}>— None —</span>
              </OptionRow>
            )}
            {loading && <div style={{ padding: '12px 14px', fontSize: 13, color: colors.textMuted }}>Loading…</div>}
            {error && <div style={{ padding: '12px 14px', fontSize: 13, color: colors.danger }}>Couldn’t load options: {error}</div>}
            {!loading && !error && byPickState.length === 0 && (
              <div style={{ padding: '12px 14px', fontSize: 13, color: colors.textMuted }}>
                {query ? `Nothing matches “${query}”.` : 'Nothing available.'}
              </div>
            )}
            {byPickState.map((option) => (
              <OptionRow key={option.slug} onClick={() => pick(option)}>
                {option.image ? (
                  <img src={option.image} alt="" style={{ width: 44, height: 30, objectFit: 'cover', borderRadius: 5, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 30, borderRadius: 5, backgroundColor: colors.panelMuted, border: `1px solid ${colors.border}`, flexShrink: 0 }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {option.label}
                  </div>
                  <code style={{ fontSize: 11, color: colors.textMuted, fontFamily: 'ui-monospace, monospace' }}>{option.slug}</code>
                </div>
              </OptionRow>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OptionRow({ onClick, children }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '8px 12px',
        border: 'none',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: hover ? colors.panelHover : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}
