// Button.jsx
// The one button. Three variants (primary amber / secondary green outline /
// tertiary text link), three sizes (sm 44 / md 48 / lg 56). All visual
// styling lives in index.css under ".btn" so hover/active/disabled states
// work — this component only picks the element and composes class names.
//
//   <Button to="/tours" variant="primary" size="lg" arrow>Explore tours</Button>
//   <Button href="#book" variant="primary" full>Book a consultation</Button>
//   <Button type="submit" variant="primary" full disabled={sending}>Send message</Button>

import { Link } from 'react-router-dom'

export default function Button({
  to,
  href,
  variant = 'secondary',
  size = 'md',
  onDark = false,
  full = false,
  arrow = false,
  disabled = false,
  type = 'button',
  onClick,
  style,
  className,
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    onDark && 'btn--on-dark',
    full && 'btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {children}
      {arrow && <span aria-hidden style={{ fontSize: '1.1em', lineHeight: 1 }}>→</span>}
    </>
  )

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} style={style} onClick={onClick} {...rest}>
        {content}
      </Link>
    )
  }

  if (href && !disabled) {
    const isExternal = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        style={style}
        onClick={onClick}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    )
  }

  // Disabled links also fall through to a real <button> so the disabled
  // attribute, focus behavior, and styling stay native.
  return (
    <button type={type} className={classes} style={style} onClick={onClick} disabled={disabled} {...rest}>
      {content}
    </button>
  )
}
