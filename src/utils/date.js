// Date input values are ISO (`YYYY-MM-DD`) everywhere in the booking flow —
// that is what `<input type="date">` gives us, what the availability map is
// keyed by, and what Google Calendar wants. It is the one thing a human
// reading an email shouldn't see: `2026-09-10` is ambiguous at a glance to a
// guest, and unreadable on a phone notification.
//
// So the ISO string stays the internal format and this is used only at the
// edges — the email params. Anything that isn't an ISO date (an empty field,
// the literal 'Flexible') passes through untouched.
export function formatDMY(dateStr) {
  if (typeof dateStr !== 'string') return dateStr
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : dateStr
}
