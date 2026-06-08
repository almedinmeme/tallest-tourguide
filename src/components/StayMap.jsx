import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix default marker icons broken by Vite bundling (same fix as RouteMap).
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), { padding: [40, 40] })
    } else if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 9)
    }
  }, [map, points])
  return null
}

// Renders a single map with a marker per accommodation that has coordinates.
export default function StayMap({ items = [] }) {
  const points = items.filter((i) => i.lat != null && i.lng != null)
  if (points.length === 0) return null

  const center = [points[0].lat, points[0].lng]

  return (
    <div style={styles.wrapper}>
      <MapContainer center={center} zoom={7} scrollWheelZoom={false} style={styles.map} attributionControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap contributors © CARTO"
        />
        <FitBounds points={points} />
        {points.map((p) => (
          <Marker key={p.slug} position={[p.lat, p.lng]}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

const styles = {
  wrapper: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-n300)', height: 360 },
  map: { width: '100%', height: '100%' },
}
