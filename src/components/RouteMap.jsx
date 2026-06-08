import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icons broken by vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ORS_KEY = import.meta.env.VITE_ORS_API_KEY

// Module-level cache — keyed by profile + concatenated coords.
// Avoids re-fetching the same route on every page mount / HMR cycle.
const routeCache = new Map()
function cacheKey(profile, waypoints) {
  return `${profile}|${waypoints.map((w) => `${w.lat},${w.lng}`).join(';')}`
}

function straightLine(from, to) {
  return [[from.lat, from.lng], [to.lat, to.lng]]
}

// Send ONE ORS request for an arbitrary number of consecutive waypoints.
// Returns { ok, coords? , error? }.
async function fetchPolyline(waypoints, profile, signal) {
  if (!ORS_KEY) return { ok: false, error: 'ORS API key not configured' }
  try {
    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
      {
        method: 'POST',
        headers: { Authorization: ORS_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates: waypoints.map((w) => [w.lng, w.lat]) }),
        signal,
      },
    )
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { ok: false, error: `ORS ${res.status}${body ? `: ${body.slice(0, 120)}` : ''}` }
    }
    const data = await res.json()
    const line = data?.features?.[0]?.geometry?.coordinates
    if (!Array.isArray(line) || line.length === 0) {
      return { ok: false, error: 'empty geometry' }
    }
    return { ok: true, coords: line.map(([lng, lat]) => [lat, lng]) }
  } catch (e) {
    if (e?.name === 'AbortError') throw e
    return { ok: false, error: e?.message || 'network error' }
  }
}

// Strategy:
//   1. Try one ORS request for all waypoints (efficient — 1 call per page view).
//   2. If that succeeds, render as a single solid segment.
//   3. If it fails, fall back to per-pair lookups so we can identify and
//      visualise which segments are bad vs good.
//   Results are memoised in routeCache so repeat renders are free.
async function resolveRoute(waypoints, profile, signal) {
  // 1. Single-shot attempt
  const batch = await fetchPolyline(waypoints, profile, signal)
  if (batch.ok) {
    return {
      segments: [{
        from: waypoints[0],
        to: waypoints[waypoints.length - 1],
        coords: batch.coords,
        status: 'ok',
      }],
      mode: 'batch',
    }
  }

  // 2. Per-segment fallback. Only fires when batch fails — keeps the
  //    number of ORS calls minimal in the common case.
  const pairs = []
  for (let i = 1; i < waypoints.length; i += 1) {
    pairs.push([waypoints[i - 1], waypoints[i]])
  }
  const results = await Promise.all(
    pairs.map(([from, to]) => fetchPolyline([from, to], profile, signal)),
  )
  const segments = results.map((r, idx) => ({
    from: pairs[idx][0],
    to: pairs[idx][1],
    coords: r.ok ? r.coords : straightLine(pairs[idx][0], pairs[idx][1]),
    status: r.ok ? 'ok' : 'fallback',
    error: r.ok ? undefined : r.error,
  }))
  return {
    segments,
    mode: 'split',
    batchError: batch.error,
  }
}

// Resolves the route for the given waypoints + profile.
// Returns:
//   loading: boolean
//   segments: [{ from, to, coords, status, error? }, …]
//   summary:  { total, ok, fallback, reason? }
export function useRoute(waypoints, profile) {
  const [state, setState] = useState({ loading: false, segments: [], summary: { total: 0, ok: 0, fallback: 0 } })
  const abortRef = useRef(null)

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort()
    if (!Array.isArray(waypoints) || waypoints.length < 2) {
      setState({ loading: false, segments: [], summary: { total: 0, ok: 0, fallback: 0 } })
      return
    }

    const key = cacheKey(profile, waypoints)
    const cached = routeCache.get(key)
    if (cached) {
      setState(cached)
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    setState((prev) => ({ ...prev, loading: true }))

    resolveRoute(waypoints, profile, controller.signal)
      .then(({ segments, batchError }) => {
        if (controller.signal.aborted) return
        const ok = segments.filter((s) => s.status === 'ok').length
        const fallback = segments.length - ok
        const reason = fallback === segments.length
          ? (batchError || segments.find((s) => s.error)?.error)
          : undefined
        const next = {
          loading: false,
          segments,
          summary: { total: segments.length, ok, fallback, reason },
        }
        routeCache.set(key, next)
        setState(next)
      })
      .catch((e) => {
        if (e?.name === 'AbortError') return
        setState({ loading: false, segments: [], summary: { total: 0, ok: 0, fallback: 0, reason: e?.message } })
      })

    return () => controller.abort()
  }, [waypoints, profile])

  return state
}

function FitBounds({ waypoints }) {
  const map = useMap()
  useEffect(() => {
    if (waypoints.length > 1) {
      const bounds = L.latLngBounds(waypoints.map((w) => [w.lat, w.lng]))
      map.fitBounds(bounds, { padding: [32, 32] })
    } else if (waypoints.length === 1) {
      map.setView([waypoints[0].lat, waypoints[0].lng], 14)
    }
  }, [map, waypoints])
  return null
}

function RouteMap({ waypoints, profile = 'foot-walking' }) {
  const { segments } = useRoute(waypoints, profile)

  if (!waypoints || waypoints.length === 0) return null

  const center = [waypoints[0].lat, waypoints[0].lng]
  const okSegments = segments.filter((s) => s.status === 'ok')
  const fallbackSegments = segments.filter((s) => s.status === 'fallback')

  // If we have no segments yet (first render, before fetch), draw the
  // straight-line skeleton as fallback so the map isn't empty.
  const showSkeleton = segments.length === 0 && waypoints.length >= 2
  const skeletonLine = showSkeleton ? waypoints.map((w) => [w.lat, w.lng]) : null

  return (
    <div style={styles.wrapper}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={true}
        style={styles.map}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='© OpenStreetMap contributors © CARTO'
        />
        <FitBounds waypoints={waypoints} />

        {okSegments.map((seg, idx) => (
          <Polyline
            key={`ok-${idx}`}
            positions={seg.coords}
            pathOptions={{ color: '#2E7D5E', weight: 3, opacity: 0.9 }}
          />
        ))}
        {fallbackSegments.map((seg, idx) => (
          <Polyline
            key={`fb-${idx}`}
            positions={seg.coords}
            pathOptions={{ color: '#2E7D5E', weight: 3, opacity: 0.7, dashArray: '6 6' }}
          />
        ))}
        {skeletonLine && (
          <Polyline
            positions={skeletonLine}
            pathOptions={{ color: '#2E7D5E', weight: 2, opacity: 0.4, dashArray: '4 6' }}
          />
        )}

        {waypoints.map((wp, i) => (
          <Marker key={i} position={[wp.lat, wp.lng]}>
            <Popup>{wp.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

const styles = {
  wrapper: {
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '32px',
    border: '1px solid var(--color-n300)',
    height: '260px',
  },
  map: {
    width: '100%',
    height: '100%',
  },
}

export default RouteMap
