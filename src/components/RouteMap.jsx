import { useEffect, useState } from 'react'
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

async function fetchRoute(waypoints, profile) {
  if (!ORS_KEY || waypoints.length < 2) return null
  const coordinates = waypoints.map((w) => [w.lng, w.lat]) // ORS uses [lng, lat]
  const res = await fetch(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    {
      method: 'POST',
      headers: {
        Authorization: ORS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates }),
    }
  )
  if (!res.ok) return null
  const data = await res.json()
  // Convert ORS [lng, lat] back to Leaflet [lat, lng]
  return data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
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
  const [routeCoords, setRouteCoords] = useState(null)

  useEffect(() => {
    if (!waypoints || waypoints.length === 0) return
    setRouteCoords(null)
    fetchRoute(waypoints, profile)
      .then((coords) => { if (coords) setRouteCoords(coords) })
      .catch(() => {})
  }, [waypoints, profile])

  if (!waypoints || waypoints.length === 0) return null

  const center = [waypoints[0].lat, waypoints[0].lng]
  const fallbackLine = waypoints.map((w) => [w.lat, w.lng])

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
        <Polyline
          positions={routeCoords ?? fallbackLine}
          pathOptions={{ color: '#2E7D5E', weight: 3, opacity: 0.85 }}
        />
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
