// Hand-picked review highlights shown in the homepage reviews section
// alongside whatever Google returns (src/data/google/reviews.json).
//
// Single source of truth is featuredReviews.json, managed at /admin → Reviews.
// Google's API only ever returns five reviews and picks them itself, so these
// keep the strongest stories on the page and cover the tours we most want
// represented. Array order is the order they appear in.
//
// Keep the text verbatim — these are real reviews people wrote. Trim only with
// an ellipsis, never reword, and leave `date` empty rather than guessing one.

import reviews from './featuredReviews.json'

export const featuredReviews = reviews

// What the site actually renders: the ones ticked "show on the site".
export const publishedFeaturedReviews = reviews.filter((r) => r.published !== false)

export default featuredReviews
