import SEO from '../components/SEO'
import { EditorialHero, ProseSection, PullQuote, EndCTA, EditorialContainer } from '../components/Editorial'
import { getPage } from '../data/pages'

export default function Hospitality() {
  const page = getPage('hospitality') || {}
  const hero = page.hero || {}
  const sections = Array.isArray(page.sections) ? page.sections : []
  const quotes = Array.isArray(page.pullQuotes) ? page.pullQuotes : []

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title={page.seo?.title || 'Gostoprimstvo — The Balkan Art of Hospitality'}
        description={page.seo?.description || 'Balkan hospitality is not a product we sell. Gostoprimstvo is the practice we live inside.'}
        url="/hospitality"
      />

      {/* The word as a typographic anchor */}
      <EditorialHero
        variant="word"
        kicker={hero.kicker}
        heading={hero.heading || 'gostoprimstvo'}
        subheading={hero.subheading}
        image={hero.image}
      />

      {/* Immersive: full-width photography between text blocks */}
      {sections.map((sec, i) => (
        <div key={sec.id || i}>
          <ProseSection section={sec} />
          {i === 1 && quotes[0] && <PullQuote quote={quotes[0].quote} attribution={quotes[0].attribution} />}
        </div>
      ))}

      {quotes.length > 1 && <PullQuote quote={quotes[1].quote} attribution={quotes[1].attribution} />}

      {/* A short note, then onward — no booking CTA on this page */}
      <EditorialContainer max={720}>
        <p style={{ fontFamily: 'var(--font-hero)', fontStyle: 'italic', fontSize: 'clamp(20px, 2.6vw, 26px)', lineHeight: 1.45, color: 'var(--color-n900)', textAlign: 'center', padding: '24px 0 8px' }}>
          This is why we travel the way we do.
        </p>
      </EditorialContainer>

      <EndCTA label={page.cta?.label || 'Read our story'} href={page.cta?.href || '/about'} note={page.cta?.note} outlined />
    </main>
  )
}
