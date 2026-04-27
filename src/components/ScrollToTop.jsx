// ScrollToTop.jsx
// This component runs on every route change and scrolls
// the window back to the top instantly.
//
// useLocation returns the current URL path — every time
// the path changes, the useEffect fires and calls
// window.scrollTo(0, 0) which snaps the viewport to the top.
//
// This component renders nothing visible — it's pure behaviour.
// It sits inside BrowserRouter in main.jsx so it has access
// to React Router's location context.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../utils/analytics'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // behavior: 'instant' scrolls immediately with no animation —
    // smooth scrolling here would feel wrong because the page
    // content is already changing. Instant reset is the right UX.
    window.scrollTo({ top: 0, behavior: 'instant' })
    trackPageView(pathname)
  }, [pathname])

  // Returns null — this component has no visual output.
  // It exists purely for its side effect.
  return null
}

export default ScrollToTop