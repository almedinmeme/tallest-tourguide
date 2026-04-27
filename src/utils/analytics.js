export function trackPageView(path) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', { page_path: path })
}

export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}
