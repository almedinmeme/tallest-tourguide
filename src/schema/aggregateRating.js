// One rule for emitting an AggregateRating, shared by the site-wide business
// schema and the per-tour/per-package product schema.
//
// An AggregateRating with reviewCount: 0 is invalid structured data. Google
// Search Console reports it as an error and discards the enclosing item, so a
// tour with no reviews yet is better off carrying no rating at all than
// carrying an empty one. Two tours were shipping reviewCount: 0 before this.

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
