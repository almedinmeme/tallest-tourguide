import { useRoute } from '../../components/RouteMap'
import { colors } from '../styles'

// Live ORS routing status, mirrored from RouteMap. Lets the operator see
// whether the public map will draw real paths or fall back to straight lines.
export default function RouteStatusBadge({ waypoints, profile }) {
  const { loading, summary } = useRoute(waypoints, profile)
  const { total, ok, fallback, reason } = summary

  const tone =
    loading       ? 'neutral' :
    total === 0   ? 'neutral' :
    fallback === 0 ? 'success' :
    ok === 0       ? 'danger' :
                     'warning'

  const palette = TONE[tone]

  let text
  if (loading) {
    text = 'Routing…'
  } else if (total === 0) {
    text = 'Add at least 2 waypoints to preview the route.'
  } else if (fallback === 0) {
    // Batch mode returns a single combined segment; split mode returns N.
    // Either way the route is fully resolved.
    text = total === 1
      ? `✓ Route resolved via ${profile}.`
      : `✓ ${ok}/${total} legs routed via ${profile}.`
  } else if (ok === 0) {
    text = `⚠ Couldn't route. Map will show straight lines.${reason ? ` (${reason})` : ''}`
  } else {
    text = `△ ${ok} of ${total} legs routed via ${profile} — others shown as dashed straight lines.`
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        borderRadius: 8,
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.bg,
        color: palette.fg,
        fontSize: 12.5,
        fontWeight: 500,
        marginBottom: 12,
      }}
    >
      {text}
    </div>
  )
}

const TONE = {
  success: { fg: colors.success, bg: colors.successSoft, border: colors.success },
  warning: { fg: colors.warning, bg: colors.warningSoft, border: colors.warning },
  danger:  { fg: colors.danger,  bg: colors.dangerSoft,  border: colors.danger  },
  neutral: { fg: colors.textSubtle, bg: colors.panelMuted, border: colors.border },
}
