// Gallery.jsx
// Full-bleed carousel strip — sits flush, no card wrapper.
// Mouse drag-to-scroll on desktop. Touch scroll on mobile.
// Click any image to open lightbox with caption support.

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

function normalise(images) {
  if (!images || images.length === 0) return []
  return images.map((img) =>
    typeof img === 'string' ? { src: img, caption: null } : img
  )
}

function Gallery({ images = [], alt = 'Gallery image' }) {
  const items = normalise(images)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const stripRef = useRef(null)

  // ── Drag-to-scroll state ──────────────────────────────────────
  // We track whether the user is dragging vs clicking.
  // If the mouse moves more than 5px during mousedown → mouseup,
  // we treat it as a drag and suppress the click (no lightbox open).
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const hasMoved = useRef(false)

  const handleMouseDown = (e) => {
    const strip = stripRef.current
    if (!strip) return
    isDragging.current = true
    hasMoved.current = false
    dragStartX.current = e.pageX - strip.offsetLeft
    dragScrollLeft.current = strip.scrollLeft
    strip.style.cursor = 'grabbing'
    strip.style.userSelect = 'none'
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const strip = stripRef.current
    if (!strip) return
    const x = e.pageX - strip.offsetLeft
    const delta = x - dragStartX.current
    if (Math.abs(delta) > 5) hasMoved.current = true
    strip.scrollLeft = dragScrollLeft.current - delta
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (stripRef.current) {
      stripRef.current.style.cursor = 'grab'
      stripRef.current.style.userSelect = ''
    }
  }

  // Attach mousemove and mouseup to window so drag works
  // even when the mouse leaves the strip element.
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // ── Lightbox ──────────────────────────────────────────────────
  const isOpen = lightboxIndex !== null
  const open = (index) => {
    // Only open lightbox if the user didn't drag
    if (!hasMoved.current) setLightboxIndex(index)
  }
  const close = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }, [items.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }, [items.length])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [isOpen, prev, next])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (items.length === 0) return null

  return (
    <>
      {/* ── CAROUSEL STRIP ────────────────────────────────────────
          Negative margins break out of the parent card's 24px padding.
          paddingLeft + paddingRight on the inner div restore alignment
          and ensure the last image has trailing space before the edge.
          marginBottom adds the gap between gallery and description.   */}
      <div
        ref={stripRef}
        onMouseDown={handleMouseDown}
        style={{
          marginLeft: '-24px',
          marginRight: '-24px',
          marginBottom: '24px',
          overflowX: 'auto',
          overflowY: 'visible',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: 'grab',
          paddingBottom: '6px', // prevents box-shadow bottom clip
        }}
      >
        {/* Inner flex row — paddingLeft and paddingRight are set
            separately (not shorthand) so the browser correctly
            includes the right padding in the scroll width.
            With shorthand `padding: '0 24px'`, some browsers
            collapse the trailing padding on overflow containers. */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => open(index)}
              style={{
                flexShrink: 0,
                width: '280px',
                height: '224px',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: 'var(--color-n300)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
              }}
              onMouseEnter={(e) => {
                if (isDragging.current) return
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)'
              }}
            >
              <img
                src={item.src}
                alt={item.caption || `${alt} ${index + 1}`}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none', // prevents browser image drag interfering
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.96)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={close}
        >
          {/* Top bar — counter + close */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              zIndex: 1001,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: '500',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.5px',
            }}>
              {lightboxIndex + 1} / {items.length}
            </span>
            <button
              onClick={close}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close lightbox"
            >
              <X size={18} color="#fff" />
            </button>
          </div>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1001,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} color="#fff" />
            </button>
          )}

          {/* Main image */}
          <img
            src={items[lightboxIndex].src}
            alt={items[lightboxIndex].caption || `${alt} ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '88vw',
              maxHeight: items[lightboxIndex].caption ? '72vh' : '80vh',
              objectFit: 'contain',
              borderRadius: '8px',
              userSelect: 'none',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              display: 'block',
            }}
          />

          {/* Caption */}
          {items[lightboxIndex].caption && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: '20px', maxWidth: '560px', textAlign: 'center', padding: '0 24px' }}
            >
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: '1.6',
                margin: 0,
              }}>
                {items[lightboxIndex].caption}
              </p>
            </div>
          )}

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1001,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              aria-label="Next image"
            >
              <ChevronRight size={24} color="#fff" />
            </button>
          )}

          {/* Thumbnail strip */}
          {items.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                padding: '20px 24px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    flexShrink: 0,
                    width: '60px',
                    height: '42px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: i === lightboxIndex ? '2px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                    opacity: i === lightboxIndex ? 1 : 0.45,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </>
  )
}

export default Gallery