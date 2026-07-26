// Single source of truth for the tour category taxonomy — used by the /tours
// filter pills, the Day Tours mega-menu rail, and the admin Tour editor.
// Order matters: it drives both the filter pills and the menu rail (Day Trips
// leads — the catalog grows through day tours and trips).

export const TOUR_CATEGORY_LABELS = {
  'day-trips':    'Day Trips',
  'city-walks':   'City Walks',
  'history':      'History & War',
  'food-culture': 'Food & Culture',
  'adventure':    'Adventure',
}

export const TOUR_CATEGORY_IDS = Object.keys(TOUR_CATEGORY_LABELS)

// A tour's `category` is its primary; `extraCategories` (admin: "Also show
// in") surfaces it in additional rows/filters — e.g. Srebrenica is history
// *and* a day trip.
export const tourCategories = (t) =>
  [t.category, ...(t.extraCategories || [])].filter(Boolean)
