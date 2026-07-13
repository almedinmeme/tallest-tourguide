// Journal post bodies are an ordered list of blocks:
//   { type: 'text',  html }                    — TipTap HTML
//   { type: 'image', src, caption }            — full-width figure
//   { type: 'promo', cardType, slug }          — inline booking card for a
//                                                tour ('tour') or package
//                                                ('package'); a post can have
//                                                several
//
// Older posts stored a fixed layout (content, inlineImage1, … , content5)
// plus post-level inlineCardSlug/inlineCardType. legacyBlocks() derives
// blocks from that shape so unmigrated data still renders; postBlocks() is
// what consumers should call — it also materialises the legacy post-level
// inline card as a promo block (after the 2nd text block, its historical
// position).

export function legacyBlocks(post) {
  const blocks = []
  for (let n = 1; n <= 5; n++) {
    const html = post[n === 1 ? 'content' : `content${n}`]
    if (html) blocks.push({ type: 'text', html })
    if (n < 5 && post[`inlineImage${n}`]) {
      blocks.push({ type: 'image', src: post[`inlineImage${n}`], caption: post[`inlineImage${n}Caption`] || '' })
    }
  }
  return blocks
}

// Insertion point for the legacy auto-placed card: after the 2nd text block,
// and after that block's image if one follows it.
function legacyPromoIndex(blocks) {
  let textSeen = 0
  let at = blocks.length
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'text') {
      textSeen++
      if (textSeen === 2) {
        at = i + 1
        break
      }
    }
  }
  if (at < blocks.length && blocks[at].type === 'image') at++
  return at
}

// Blocks as they should render on the public post.
export function postBlocks(post) {
  let blocks =
    Array.isArray(post.blocks) && post.blocks.length > 0 ? post.blocks.slice() : legacyBlocks(post)

  if (post.inlineCardSlug) {
    // Data saved before promo blocks carried their own card: fill the marker,
    // or insert one at the historical position.
    const legacyCard = { cardType: post.inlineCardType === 'package' ? 'package' : 'tour', slug: post.inlineCardSlug }
    if (blocks.some((b) => b.type === 'promo')) {
      blocks = blocks.map((b) => (b.type === 'promo' && !b.slug ? { ...b, ...legacyCard } : b))
    } else {
      blocks.splice(legacyPromoIndex(blocks), 0, { type: 'promo', ...legacyCard })
    }
  }

  return blocks
}

// Every tour/package a post promotes inline — used for reverse lookups
// ("posts that feature this tour").
export function postPromoRefs(post) {
  return postBlocks(post)
    .filter((b) => b.type === 'promo' && b.slug)
    .map((b) => ({ type: b.cardType === 'package' ? 'package' : 'tour', slug: b.slug }))
}
