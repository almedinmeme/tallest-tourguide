// src/hooks/useWindowWidth.js
// This custom hook returns the current width of the browser window.
// It updates automatically whenever the window is resized —
// for example when a user rotates their phone from portrait to landscape.
//
// Any component that imports this hook gets instant access to the
// current window width as a number, which they can use to make
// layout decisions — exactly like responsive breakpoints in CSS,
// but available inside your JavaScript logic.

import { useState, useEffect } from 'react'

function useWindowWidth() {

  // Start with the actual current window width as the initial value.
  // window.innerWidth is a browser API that returns the viewport width in pixels.
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    // This function runs every time the window is resized.
    // It updates our width state with the new value,
    // which causes any component using this hook to rerender
    // with the correct layout for the new screen size.
    const handleResize = () => setWidth(window.innerWidth)

    // addEventListener attaches our function to the window's resize event.
    // Every time the browser fires a resize event, handleResize runs.
    window.addEventListener('resize', handleResize)

    // This return function is called "cleanup" — it runs when the
    // component unmounts (is removed from the page).
    // Removing the event listener prevents memory leaks —
    // without this, old listeners would pile up every time
    // a component remounts, eventually slowing down the browser.
    return () => window.removeEventListener('resize', handleResize)

  }, []) // The empty array means this effect runs once when the component mounts

  return width
}

export default useWindowWidth