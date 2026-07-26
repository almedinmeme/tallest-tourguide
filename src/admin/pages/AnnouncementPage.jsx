// Site-wide announcement bar — the singleton banner shown above the nav on
// every public page. Backed by src/data/announcement.json via
// GET/PUT /api/admin/announcement.
import { useEffect, useRef, useState } from 'react'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import SaveButton from '../components/SaveButton'
import { useToast } from '../hooks/useToast'
import { useDirtyTracker } from '../hooks/dirtyContext'

export default function AnnouncementPage() {
  const [item, setItem] = useState(null)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const { dirty, markSaved } = useDirtyTracker(item)

  useEffect(() => {
    api.announcement.get().then(setItem).catch((e) => setErr(e.message))
  }, [])

  const set = (patch) => setItem((t) => ({ ...t, ...patch }))

  const codes = Array.isArray(item?.promoCodes) ? item.promoCodes : []
  const setCode = (i, patch) =>
    set({ promoCodes: codes.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) })
  const addCode = () =>
    set({ promoCodes: [...codes, { code: '', type: 'percent', value: 10, enabled: true, startDate: '', endDate: '', note: '' }] })
  const removeCode = (i) => set({ promoCodes: codes.filter((_, idx) => idx !== i) })

  const savingRef = useRef(false)
  const onSave = async () => {
    if (savingRef.current || !item) return
    savingRef.current = true
    setSaving(true)
    try {
      const saved = await api.announcement.update(item)
      setItem(saved)
      markSaved(saved)
      toast.success('Promotions saved — banner and codes apply site-wide')
    } catch (e) {
      toast.error(`Save failed: ${e.message}`)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const onSaveRef = useRef()
  onSaveRef.current = onSave
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSaveRef.current?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (err && !item) return <div style={{ color: colors.danger }}>{err}</div>
  if (!item) return <div>Loading…</div>

  const today = new Date().toISOString().slice(0, 10)
  const scheduledOff = item.startDate && item.startDate > today
  const scheduledExpired = item.endDate && item.endDate < today

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Promotions</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            The announcement bar shown above the menu on every page, and the promo codes
            guests can redeem at checkout.
          </div>
        </div>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>

      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Announcement bar</h2>
        <FormField label="" full>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: colors.text, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!item.enabled}
              onChange={(e) => set({ enabled: e.target.checked })}
            />
            Show this banner on the site
          </label>
        </FormField>
        {item.enabled && (scheduledOff || scheduledExpired) && (
          <div style={{ ...s.hint, color: colors.warning, marginTop: 4 }}>
            {scheduledExpired
              ? "This banner's end date has passed — it's enabled but won't show until you change the dates."
              : "This banner's start date hasn't arrived yet — it's enabled but won't show until then."}
          </div>
        )}

        <h2 style={{ ...s.h2 }}>Message</h2>
        <FormField label="Label (optional)" hint="A few words shown in small caps before the message, e.g. “Limited offer”, “We're hiring”, “Notice”.">
          <input
            style={{ ...s.input, maxWidth: 280 }}
            value={item.kicker || ''}
            onChange={(e) => set({ kicker: e.target.value })}
            placeholder="Limited offer"
          />
        </FormField>
        <FormField label="Message" hint="Keep it short — one line, e.g. “20% off all Food & Culture tours this week.”">
          <input
            style={s.input}
            value={item.message || ''}
            onChange={(e) => set({ message: e.target.value })}
            placeholder="20% off all Food & Culture tours this week"
          />
        </FormField>
        <div style={s.grid2}>
          <FormField label="Button label (optional)" hint="Leave blank for a plain message with no link.">
            <input
              style={s.input}
              value={item.ctaLabel || ''}
              onChange={(e) => set({ ctaLabel: e.target.value })}
              placeholder="See tours"
            />
          </FormField>
          <FormField label="Button link" hint="Where the button goes, e.g. /tours or /contact.">
            <input
              style={s.input}
              value={item.ctaHref || ''}
              onChange={(e) => set({ ctaHref: e.target.value })}
              placeholder="/tours"
            />
          </FormField>
        </div>

        <h2 style={s.h2}>More details (optional)</h2>
        <p style={s.subheadingHint}>
          Fill this in and the bar gets a <strong>Details</strong> link in its right corner that
          opens a pop-up with the full story — hiring requirements, promo conditions, new
          opening hours. Leave the text empty and no link appears.
        </p>
        <FormField label="Pop-up headline" hint="Blank = the bar's message is reused as the headline.">
          <input
            style={s.input}
            value={item.detailsTitle || ''}
            onChange={(e) => set({ detailsTitle: e.target.value })}
            placeholder="We're looking for guides for the 2027 season"
          />
        </FormField>
        <FormField
          label="Pop-up text"
          hint="A blank line starts a new paragraph. Start lines with “-” to make a bullet list."
        >
          <textarea
            style={{ ...s.textarea, minHeight: 140 }}
            value={item.detailsBody || ''}
            onChange={(e) => set({ detailsBody: e.target.value })}
            placeholder={'We are growing our team for next season.\n\n- Licensed guide, English C1 or better\n- Based in or near Sarajevo\n- Weekend availability\n\nSend your CV to hello@tallesttourguide.com and we will get back to you within a week.'}
          />
        </FormField>

        <h2 style={s.h2}>Style</h2>
        <FormField label="Tone" hint="The bar is always deep green; the tone sets the accents. Amber highlights and a solid amber button for promos and discounts; a quieter outlined look for informational notices like hours changes or hiring.">
          <select style={s.input} value={item.tone || 'amber'} onChange={(e) => set({ tone: e.target.value })}>
            <option value="amber">Amber accents — promo / discount</option>
            <option value="green">Quiet — informational</option>
          </select>
        </FormField>

        <h2 style={s.h2}>Schedule (optional)</h2>
        <p style={s.subheadingHint}>
          Leave both blank to show the banner for as long as it's enabled. Set dates to have it
          appear and disappear automatically — handy for a promo with a deadline.
        </p>
        <div style={s.grid2}>
          <FormField label="Starts showing" hint="Blank = show immediately.">
            <input
              type="date"
              style={s.input}
              value={item.startDate || ''}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </FormField>
          <FormField label="Stops showing" hint="Blank = no end date.">
            <input
              type="date"
              style={s.input}
              value={item.endDate || ''}
              onChange={(e) => set({ endDate: e.target.value })}
            />
          </FormField>
        </div>
      </section>

      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Promo &amp; referral codes</h2>
        <p style={s.subheadingHint}>
          Guests enter a code at checkout under “Have a referral or promo code?”. A code listed
          here (and active) takes its discount off the tour price — optional add-ons are always
          charged in full — shown as its own line in the price summary. Codes <em>not</em> listed
          here are still accepted and arrive on the booking as plain text — useful for partner
          attribution without a discount.
        </p>

        {codes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <div style={{ ...codeRowStyle, ...codeHeadStyle }}>
              <span>Code</span>
              <span>Discount</span>
              <span>Valid from</span>
              <span>Until</span>
              <span>Note</span>
              <span style={{ textAlign: 'center' }}>Active</span>
              <span />
            </div>
            {codes.map((c, i) => (
              <div key={i} style={codeRowStyle}>
                <input
                  style={s.input}
                  value={c.code || ''}
                  onChange={(e) => setCode(i, { code: e.target.value })}
                  placeholder="SUMMER10"
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    style={{ ...s.input, width: 64 }}
                    type="number"
                    min="0"
                    value={c.value ?? ''}
                    onChange={(e) => setCode(i, { value: e.target.value === '' ? '' : Number(e.target.value) })}
                  />
                  <select
                    style={{ ...s.input, width: 78 }}
                    value={c.type === 'fixed' ? 'fixed' : 'percent'}
                    onChange={(e) => setCode(i, { type: e.target.value })}
                  >
                    <option value="percent">% off</option>
                    <option value="fixed">€ off</option>
                  </select>
                </div>
                <input
                  style={s.input}
                  type="date"
                  value={c.startDate || ''}
                  onChange={(e) => setCode(i, { startDate: e.target.value })}
                />
                <input
                  style={s.input}
                  type="date"
                  value={c.endDate || ''}
                  onChange={(e) => setCode(i, { endDate: e.target.value })}
                />
                <input
                  style={s.input}
                  value={c.note || ''}
                  onChange={(e) => setCode(i, { note: e.target.value })}
                  placeholder="Who it's for"
                />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    checked={c.enabled !== false}
                    onChange={(e) => setCode(i, { enabled: e.target.checked })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCode(i)}
                  title="Remove this code"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.danger,
                    fontSize: 16,
                    lineHeight: 1,
                    padding: 4,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="button" onClick={addCode} style={{ ...s.btnGhost, fontSize: 13 }}>
          + Add a code
        </button>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>
    </div>
  )
}

// Grid template shared by the codes header and rows so columns stay aligned.
const codeRowStyle = {
  display: 'grid',
  gridTemplateColumns: '150px 152px 130px 130px 1fr 52px 28px',
  gap: 10,
  alignItems: 'center',
}

const codeHeadStyle = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: colors.textMuted,
}
