// Single source of truth for destination/region data is
// src/data/destinations.json, edited via the local /admin panel.
// Image fields are URL strings served from public/uploads/.

import destinations from './destinations.json'

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

export const sortedDestinations = [...destinations].sort(byOrder)

export function getDestination(slug) {
  return destinations.find((d) => d.slug === slug) || null
}

export { destinations }
export default destinations
