import { s, colors } from '../styles'

// Three-state save button: "Saving…" while in flight, "Save changes" (with a
// dot) when there are unsaved edits, disabled "Saved" when clean.
const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

export default function SaveButton({ dirty, saving, isNew, onClick }) {
  const needsSave = dirty || isNew
  return (
    <button
      style={{
        ...s.btn,
        ...(needsSave || saving ? {} : { backgroundColor: colors.panelMuted, color: colors.textMuted, boxShadow: 'none', cursor: 'default' }),
      }}
      onClick={onClick}
      disabled={saving || (!needsSave && !isNew)}
      title={`Save (${isMac ? '⌘' : 'Ctrl+'}S)`}
    >
      {needsSave && !saving && (
        <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: colors.accent, flexShrink: 0 }} />
      )}
      {saving ? 'Saving…' : needsSave ? 'Save changes' : 'Saved'}
    </button>
  )
}
