// Straight-line (haversine) distance helpers. Used by the AccessibilityEditor's
// "Recalculate from waypoints" button. Always an approximation of actual
// walking / driving distance — typically 20–40 % shorter than road-following
// routes — but useful as a quick planning figure with no API call.

const EARTH_RADIUS_KM = 6371

function toRad(deg) {
  return (deg * Math.PI) / 180
}

export function haversineKm(a, b) {
  if (!a || !b) return 0
  const lat1 = Number(a.lat)
  const lat2 = Number(b.lat)
  const lng1 = Number(a.lng)
  const lng2 = Number(b.lng)
  if (!Number.isFinite(lat1) || !Number.isFinite(lat2) || !Number.isFinite(lng1) || !Number.isFinite(lng2)) return 0
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function totalDistanceKm(waypoints) {
  if (!Array.isArray(waypoints) || waypoints.length < 2) return 0
  let total = 0
  for (let i = 1; i < waypoints.length; i += 1) {
    total += haversineKm(waypoints[i - 1], waypoints[i])
  }
  return total
}
