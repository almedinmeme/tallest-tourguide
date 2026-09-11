// Google Ads conversion actions. Bookings and enquiries are deliberately
// separate actions: on one blended action, Maximize conversions optimises
// toward whichever is cheapest to generate — always the enquiry forms — so
// the budget drifts from people who book to people who ask questions.
export const BOOKING_CONVERSION = 'AW-18332364065/F_YZCI7f0-AcEKHaxqVE'
// TODO: replace the label below once the "Journey Enquiry" action (Submit
// lead form) exists in Google Ads. Until then enquiry conversions fire and
// record nothing — the flows themselves are unaffected.
export const ENQUIRY_CONVERSION = 'AW-18332364065/REPLACE_WITH_ENQUIRY_LABEL'
// Expected value of an enquiry: average booking value × close rate. Kept
// well below a real booking total so bidding still favours checkout.
export const ENQUIRY_VALUE = 15

export function trackPageView(path) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', { page_path: path })
}

export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}
