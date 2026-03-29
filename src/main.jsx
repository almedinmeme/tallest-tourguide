import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import ScrollToTop from './components/ScrollToTop'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* ScrollToTop sits inside BrowserRouter so it has
          access to React Router's location context.
          It fires on every route change before the new
          page renders — guaranteeing every page starts
          at the top regardless of where the visitor was. */}
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
)