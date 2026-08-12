// One rule for emitting an AggregateRating, shared by the site-wide business
// schema and the per-tour/per-package product schema.
//
// An AggregateRating with reviewCount: 0 is invalid structured data. Google
// Search Console reports it as an error and discards the enclosing item, so a
// tour with no reviews yet is better off carrying no rating at all than
// carrying an empty one. Two tours were shipping reviewCount: 0 before this.
//
// Where the result may be attached matters as much as what's in it. Google's
// review snippet accepts a closed list of parent types — Product,
// LocalBusiness (TravelAgency counts), Organization, Event, Recipe, Course,
// Book, Movie, HowTo, Game, SoftwareApplication, MediaObject and the
// CreativeWork series types. Anything else, TouristAttraction and TouristTrip
// included, is reported as "Invalid object type for field <parent_node>" and
// is a critical error. Hang the rating on the page's Product node instead.

export function aggregateRating(ratingValue, reviewCount) {
  if (!ratingValue || !reviewCount || reviewCount < 1) return undefined
  return {
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating: '5',
    worstRating: '1',
  }
}
