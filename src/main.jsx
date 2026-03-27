// main.jsx
// This is the entry point of your entire application.
// It boots React, wraps the app in a Router so navigation works,
// and mounts everything into the <div id="root"> in index.html.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter is the container that makes routing possible.
        Everything inside it can use navigation features. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)