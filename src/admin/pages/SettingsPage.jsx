// Site settings — the singleton contact/social details every public surface
// reads (footer, contact page, WhatsApp buttons, schema markup). Backed by
// src/data/settings.json via GET/PUT /api/admin/settings.
import { useEffect, useRef, useState } from 'react'
import * as api from '../api'
import { s, colors } from '../styles'
import FormField from '../components/FormField'
import SaveButton from '../components/SaveButton'
import { useToast } from '../hooks/useToast'
import { useDirtyTracker } from '../hooks/dirtyContext'

export default function SettingsPage() {
  const [item, setItem] = useState(null)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const { dirty, markSaved } = useDirtyTracker(item)

  useEffect(() => {
    api.settings.get().then(setItem).catch((e) => setErr(e.message))
  }, [])

  const set = (patch) => setItem((t) => ({ ...t, ...patch }))
  const setRate = (code, v) =>
    setItem((t) => ({ ...t, currencyRates: { ...(t.currencyRates || {}), [code]: v } }))

  const savingRef = useRef(false)
  const onSave = async () => {
    if (savingRef.current || !item) return
    savingRef.current = true
    setSaving(true)
    try {
      const saved = await api.settings.update(item)
      setItem(saved)
      markSaved(saved)
      toast.success('Settings saved — they apply site-wide')
    } catch (e) {
      toast.error(`Save failed: ${e.message}`)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  // Same Cmd/Ctrl+S affordance as the collection editors.
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

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.h1}>Settings</h1>
          <div style={{ ...s.subtle, marginTop: 4 }}>
            Contact details and social links used across the whole public site.
          </div>
        </div>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>

      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Contact</h2>
        <div style={s.grid2}>
          <FormField label="Email" hint="Footer, contact page, checkout help text, and the schema markup Google reads.">
            <input style={s.input} type="email" value={item.contactEmail || ''} onChange={(e) => set({ contactEmail: e.target.value })} />
          </FormField>
          <FormField label="Phone (as displayed)" hint="Shown exactly like this, e.g. +387 62 664 244.">
            <input style={s.input} value={item.phoneDisplay || ''} onChange={(e) => set({ phoneDisplay: e.target.value })} />
          </FormField>
        </div>
        <FormField label="WhatsApp number" hint="Digits only, with country code and no + (e.g. 38762664244) — builds every wa.me link on the site.">
          <input style={s.input} value={item.whatsappNumber || ''} onChange={(e) => set({ whatsappNumber: e.target.value.replace(/[^\d]/g, '') })} />
        </FormField>
      </section>

      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Social & review profiles</h2>
        <FormField label="Instagram URL" hint="Footer icon and schema markup.">
          <input style={s.input} value={item.instagramUrl || ''} onChange={(e) => set({ instagramUrl: e.target.value })} />
        </FormField>
        <FormField label="TripAdvisor URL" hint="Footer, the reviews section's “read all reviews” link, and schema markup.">
          <input style={s.input} value={item.tripadvisorUrl || ''} onChange={(e) => set({ tripadvisorUrl: e.target.value })} />
        </FormField>
      </section>

      <section style={s.card}>
        <h2 style={{ ...s.h2, marginTop: 0 }}>Currency</h2>
        <p style={s.subheadingHint}>
          All prices are entered and stored in <strong>euros</strong>. The site shows a visitor's
          own currency automatically — US → dollars, UK → pounds, everywhere else → euros — and
          they can switch it themselves. These rates do that conversion, so keep them roughly
          current (check a site like xe.com every few months).
        </p>
        <div style={s.grid2}>
          <FormField label="€1 in US dollars" hint="e.g. 1.08 — a €250 tour then shows as $270.">
            <input
              style={s.input}
              type="number"
              step="0.01"
              min="0"
              value={item.currencyRates?.USD ?? ''}
              onChange={(e) => setRate('USD', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </FormField>
          <FormField label="€1 in British pounds" hint="e.g. 0.86 — a €250 tour then shows as £215.">
            <input
              style={s.input}
              type="number"
              step="0.01"
              min="0"
              value={item.currencyRates?.GBP ?? ''}
              onChange={(e) => setRate('GBP', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </FormField>
          <FormField label="€1 in Bosnian marks" hint="Fixed at 1.95583 — the mark is pegged to the euro, so this never needs changing.">
            <input
              style={s.input}
              type="number"
              step="0.00001"
              min="0"
              value={item.currencyRates?.BAM ?? ''}
              onChange={(e) => setRate('BAM', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </FormField>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SaveButton dirty={dirty} saving={saving} onClick={onSave} />
      </div>
    </div>
  )
}
