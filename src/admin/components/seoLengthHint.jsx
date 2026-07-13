// Live length hint for SEO meta fields: quiet while under the limit Google
// typically displays in full, amber once past it. Used as a FormField hint.
export default function seoLengthHint(value, max, what) {
  const len = (value || '').length
  if (len === 0) return `Aim for under ${max} characters so Google shows the whole ${what}.`
  return (
    <span style={{ color: len > max ? '#c9760a' : undefined, fontWeight: len > max ? 600 : undefined }}>
      {len}/{max} characters{len > max ? ` — Google will likely truncate this ${what}` : ''}
    </span>
  )
}
