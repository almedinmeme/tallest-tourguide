// Renders text from the admin: HTML (TipTap output) when the string starts
// with a tag, otherwise plain text split into paragraphs by blank lines.
// Used wherever editable rich-text fields are surfaced on the public site.

function isHtml(s) {
  return typeof s === 'string' && s.trim().startsWith('<')
}

export default function RichContent({ value, paragraphStyle, paragraphClassName, htmlClassName, htmlStyle }) {
  if (value == null || value === '') return null

  if (isHtml(value)) {
    return (
      <div
        className={`rich-content ${htmlClassName || ''}`}
        style={htmlStyle}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }

  const parts = String(value).split('\n\n')
  return parts.map((p, i) => (
    <p
      key={i}
      className={paragraphClassName}
      style={{
        ...paragraphStyle,
        ...(typeof paragraphStyle?.marginBottom === 'undefined' && i < parts.length - 1
          ? { marginBottom: '16px' }
          : {}),
      }}
    >
      {p}
    </p>
  ))
}
