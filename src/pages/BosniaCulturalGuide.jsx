// BosniaCulturalGuide.jsx
// The Bosnia travel guide — a genuine cultural briefing, not a logistics
// checklist. The copy is the asset here; this file frames it in the editorial
// design generation (Newsreader titles, open layout, no boxed callouts) with
// the shared SectionNav. Article JSON-LD marks it as an authored guide.
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from '../components/Button'
import InfoHero from '../components/InfoHero'
import SectionNav from '../components/SectionNav'
import { siteUrl, SITE_ORIGIN } from '../utils/seo'

const NAVBAR_HEIGHT = 68

const inlineLink = { color: 'var(--color-forest-green)', fontWeight: 700, textDecoration: 'none' }

const sections = [
  {
    id: 'visas',
    number: '01',
    title: 'Visas & entry',
    content: [
      {
        type: 'p',
        text: 'Bosnia and Herzegovina is not a member of the European Union or the Schengen Area. Citizens of most Western countries — including the EU, UK, United States, Canada, and Australia — can enter without a visa and stay up to 90 days within a 180-day period. Your passport must be valid for at least three months beyond your planned departure date.',
      },
      {
        type: 'p',
        text: 'You will pass through standard border control, not an internal EU crossing. Keep your accommodation details on hand — it is not unusual to be asked. If you are arriving by bus from Croatia or Serbia, the crossing is usually quick but not guaranteed. Factor time into your schedule.',
      },
      {
        type: 'callout',
        text: 'Bosnia is not in the EU or Schengen. Your EU roaming plan very likely does not cover it — check before you arrive.',
      },
    ],
  },
  {
    id: 'money',
    number: '02',
    title: 'Currency & money',
    content: [
      {
        type: 'p',
        text: 'The official currency is the Bosnian Convertible Mark — BAM, or KM locally. The exchange rate is fixed by law: 1 EUR = 1.95583 BAM. This has been the rate since 1995 and it will not change. The mental shortcut: roughly half a euro per KM.',
      },
      {
        type: 'p',
        text: 'Cards are widely accepted in Sarajevo\'s restaurants, hotels, and larger shops. The moment you leave the main city areas — market stalls, smaller towns, rural spots — cash becomes necessary. ATMs are plentiful and reliable. Withdraw BAM directly rather than exchanging at the border, where rates are unfavourable.',
      },
    ],
  },
  {
    id: 'food',
    number: '03',
    title: 'What to eat (and drink)',
    content: [
      {
        type: 'p',
        text: 'Bosnian food is built on meat, bread, dairy, and things slow-cooked until they fall apart. The national dish is ćevapi — small grilled minced-meat sausages served in a flatbread called somun, with raw onion and kajmak (a rich clotted cream). Every restaurant has them. Not every restaurant makes them equally well.',
      },
      {
        type: 'p',
        text: 'Burek is the other essential: phyllo pastry, usually filled with minced meat, though spinach and cheese versions exist. It is breakfast food, eaten standing at a pekara (bakery) with yoghurt. Do not confuse it with the Turkish or Greek versions — Bosnians are particular about this.',
      },
      {
        type: 'callout',
        text: 'Bosnian coffee arrives in a small copper pot (džezva) with a sugar cube and a glass of water. You pour it yourself, slowly. The culture here is about sitting and making no particular plans to leave.',
      },
      {
        type: 'p',
        text: 'Other things worth trying: dolma (stuffed peppers or cabbage), klepe (beef dumplings with yoghurt), tarhana soup, and tufahija — a whole apple poached in syrup and stuffed with walnuts. Rakija (fruit brandy) is the social lubricant of the Balkans. You will be offered it. Accepting is polite.',
      },
    ],
  },
  {
    id: 'language',
    number: '04',
    title: 'Language',
    content: [
      {
        type: 'p',
        text: 'Bosnia has three official languages: Bosnian, Croatian, and Serbian. They are mutually intelligible — effectively the same language with political distinctions. Do not get drawn into a debate about which is "correct." It is not a debate with a good outcome for a visitor.',
      },
      {
        type: 'p',
        text: 'English is widely spoken in Sarajevo, especially among anyone under 40 working in hospitality. A few words in the local language go a long way — not because you need them, but because Bosnians notice the effort.',
      },
      {
        type: 'phrases',
        items: [
          { local: 'Hvala', phonetic: 'HVAH-lah', meaning: 'Thank you' },
          { local: 'Dobar dan', phonetic: 'DOH-bar dahn', meaning: 'Good day' },
          { local: 'Molim', phonetic: 'MOH-leem', meaning: 'Please / You\'re welcome' },
          { local: 'Izvolite', phonetic: 'eez-VOH-lee-teh', meaning: 'Here you are' },
          { local: 'Doviđenja', phonetic: 'doh-vee-JEH-nyah', meaning: 'Goodbye' },
        ],
      },
    ],
  },
  {
    id: 'religion',
    number: '05',
    title: 'Religion & daily life',
    content: [
      {
        type: 'p',
        text: 'Sarajevo is genuinely religiously diverse in a way that few cities still are. Within a few hundred metres you will find a mosque, a Catholic cathedral, an Orthodox church, and a synagogue. This proximity is not accidental — it is the result of centuries of Ottoman, Austro-Hungarian, and Yugoslavian history layered on top of each other.',
      },
      {
        type: 'p',
        text: 'The majority of Bosniaks are Muslim, though the practice ranges from devout to barely observational. The adhan — the call to prayer — sounds five times daily from mosque minarets. You will hear it in Baščaršija. Treat it as part of the city\'s texture.',
      },
      {
        type: 'bullets',
        title: 'When visiting mosques:',
        items: [
          'Remove your shoes before entering',
          'Dress modestly — shoulders and knees covered',
          'Friday midday prayers (roughly 12:00–13:00) bring brief closures',
        ],
      },
      {
        type: 'p',
        text: 'Do not assume everyone is religious. The woman in a hijab and the man with a beer at the next table may well be good friends.',
      },
    ],
  },
  {
    id: 'politics',
    number: '06',
    title: 'The political structure',
    content: [
      {
        type: 'p',
        text: 'Bosnia operates under a system established by the Dayton Peace Agreement, signed in 1995 to end the war. The country is divided into two entities: the Federation of Bosnia and Herzegovina (predominantly Bosniak and Croat, covering roughly 51% of the territory) and Republika Srpska (predominantly Serb, covering roughly 49%). There is also the Brčko District, a small self-governing area in the northeast that belongs to neither entity.',
      },
      {
        type: 'p',
        text: 'At the state level, Bosnia has a three-member rotating presidency — one Bosniak, one Croat, one Serb — who take six-month turns as the chair. The system is complicated by design: Dayton was built to stop a war, not to create an efficient state.',
      },
      {
        type: 'callout',
        text: 'For day-to-day life as a visitor, none of this affects your experience directly. But understanding the framework helps you make sense of conversations you will overhear.',
      },
    ],
  },
  {
    id: 'war',
    number: '07',
    title: 'The war — how to approach it',
    content: [
      {
        type: 'p',
        text: 'The Bosnian War lasted from 1992 to 1995. The Siege of Sarajevo — the longest siege of a capital city in the history of modern warfare — lasted 1,425 days. The Srebrenica genocide, in which more than 8,000 Bosniak men and boys were killed in July 1995, was the worst atrocity in Europe since the Second World War.',
      },
      {
        type: 'p',
        text: 'This is not distant history. The people who lived through it are in their 40s, 50s, and 60s. Many of your restaurant servers, taxi drivers, and shopkeepers lost family. The rose-shaped scars in the pavement are where mortar shells landed and killed people — filled with red resin as a memorial.',
      },
      {
        type: 'callout',
        text: 'If someone shares their story with you, listen. Do not say "at least it\'s over now" or "I understand what you went through." You do not. Just listen.',
      },
    ],
  },
  {
    id: 'dontsay',
    number: '08',
    title: 'What not to say',
    content: [
      {
        type: 'p',
        text: 'A short, honest list.',
      },
      {
        type: 'bullets',
        items: [
          'Do not say "Yugoslavia" as shorthand for Bosnia. Yugoslavia no longer exists, and the distinction matters deeply.',
          'Do not conflate Bosniaks with being Arab or Middle Eastern. Bosniaks are South Slavic people who converted to Islam under the Ottomans — they are European, and have been for six centuries.',
          'Do not ask "who started the war" expecting a simple answer. The causes are complex; the question often lands as provocative rather than curious.',
          'Do not say "it\'s like Croatia" or "it\'s like Serbia." Bosnia has its own distinct culture, food, and identity.',
          'Do not treat Sarajevo as a trauma tourism destination. The war is part of the story — it is not the whole story.',
        ],
      },
    ],
  },
  {
    id: 'hospitality',
    number: '09',
    title: 'How Bosnians feel about tourists',
    content: [
      {
        type: 'p',
        text: 'Warmly. Genuinely. The concept of gostoprimljivost — Bosnian hospitality — is not a marketing line. It is a cultural reflex. If you are lost, someone will walk you to where you need to go rather than just pointing.',
      },
      {
        type: 'p',
        text: 'Bosnians are proud of their city and aware that most of the world knows Bosnia only from war coverage. Visitors who arrive curious rather than pitying, who want to understand rather than just observe — they are welcomed warmly. The locals notice when you learn a word or two, try the food, and ask questions that show you have done some reading.',
      },
      {
        type: 'p',
        text: 'Sarajevo specifically has a dry, self-deprecating humour about its situation. Lean into it. The jokes about the Siege and the politics are better coming from the people who lived it — but they appreciate it when you can laugh alongside them rather than looking horrified.',
      },
      {
        type: 'node',
        node: (
          <>
            It's why we travel the way we do — genuinely small groups, and stays in{' '}
            <Link to="/where-we-stay" style={inlineLink}>family-owned places</Link> where{' '}
            <Link to="/hospitality" style={inlineLink}>gostoprimstvo</Link> is the point, not a slogan.
          </>
        ),
      },
    ],
  },
  {
    id: 'safety',
    number: '10',
    title: 'Safety',
    content: [
      {
        type: 'p',
        text: 'Sarajevo is a safe city by any reasonable European standard. Petty crime exists — watch your belongings in crowded markets and on public transport. Violent crime against tourists is rare.',
      },
      {
        type: 'p',
        text: 'Landmines remain a real legacy of the 1992–95 war, concentrated in areas that saw front lines: parts of the confrontation zones around Sarajevo\'s former siege perimeter, sections of eastern Bosnia, and rural stretches near the old inter-entity boundary line. This is not a concern in Sarajevo itself or on any of our tour routes — all marked and maintained.',
      },
      {
        type: 'callout',
        text: 'The practical rule for independent hikers: stay on marked trails and don\'t cross fences, overgrown fields, or abandoned buildings in rural areas, especially anywhere that saw fighting. Signage (a red skull-and-crossbones sign, sometimes just red-and-white tape) marks known risk zones — take it seriously even if the area looks harmless. If you\'re planning to hike somewhere off our tours, check with your accommodation host first; locals know which specific fields and forests to avoid far better than any general guide can tell you.',
      },
      {
        type: 'p',
        text: 'Emergency numbers: 112 (general), 122 (police), 124 (ambulance). Keep travel insurance details accessible.',
      },
      {
        type: 'node',
        node: (
          <>
            For how we plan around conditions and look after guests on tour, read{' '}
            <Link to="/safe-travels" style={inlineLink}>Safe travels</Link>.
          </>
        ),
      },
    ],
  },
  {
    id: 'details',
    number: '11',
    title: 'Details nobody tells you',
    content: [
      {
        type: 'p',
        text: 'A short list of things that save time or money and aren\'t obvious from outside:',
      },
      {
        type: 'bullets',
        items: [
          'Museum combo tickets — several Sarajevo museums (War Childhood Museum, Tunnel of Hope, History Museum) don\'t advertise combined tickets loudly; asking at the first one you visit sometimes surfaces a discount for the others.',
          'Friday and Saturday nights get genuinely busy in Baščaršija — if you want a quiet dinner without a wait, eat earlier (before 7:30pm) or later (after 9:30pm).',
          'Public holidays matter more here than elsewhere. Bosnia observes separate holidays for different communities (Orthodox and Catholic Christmas, Eid al-Fitr, Eid al-Adha, Statehood Day) — some shops and offices close on days that wouldn\'t register as holidays in Western Europe. Check the dates before you plan errands around a specific day.',
          'Border crossings by bus (to/from Croatia or Serbia) can add 1–2 hours unpredictably at peak summer weekends — build slack into any onward travel booked for the same day.',
        ],
      },
    ],
  },
]

function BosniaCulturalGuide() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const [activeId, setActiveId] = useState('visas')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = NAVBAR_HEIGHT + 44 + 16
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Bosnia Travel Guide — Good Things to Know',
    description: 'A Bosnia travel guide written by a local guide: visas, money, what to eat, the language, religion, politics, how to approach the war — and how Bosnians actually feel about visitors.',
    url: siteUrl('/bosnia-guide'),
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Almedin Omerović' },
    publisher: {
      '@type': 'Organization',
      name: 'Tallest Tourguide',
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/og-image.jpg` },
    },
  }

  return (
    <div style={{ backgroundColor: 'var(--color-n000)', minHeight: '100vh' }}>
      <SEO
        title="Bosnia Travel Guide — Good Things to Know"
        description="A Bosnia travel guide written by a local guide: visas, money, what to eat, the language, religion, politics, how to approach the war — and how Bosnians actually feel about visitors."
        url="/bosnia-guide"
        image="https://tallesttourguide.com/og-image.jpg"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <InfoHero
        kicker="Before you go"
        title="The Bosnia travel guide"
        lede="Not a logistics checklist. A genuine guide to the country you are about to visit — its food, politics, history, and people. It's the context we build every small-group tour on."
        meta="Written by your guide · 11 topics · 11 min read"
      />

      {/* Sticky section nav */}
      <SectionNav sections={sections} activeId={activeId} onScrollTo={scrollTo} isMobile={isMobile} />

      {/* Article */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: isMobile ? '32px 20px 72px' : '48px 40px 96px',
      }}>
        <article style={{ minWidth: 0 }}>

          {sections.map(({ id, number, title, content }, idx) => (
            <section
              key={id}
              id={id}
              style={{
                scrollMarginTop: '120px',
                borderTop: idx === 0 ? 'none' : '1px solid var(--color-n200)',
                paddingTop: idx === 0 ? 0 : '36px',
                marginTop: idx === 0 ? 0 : '36px',
              }}
            >
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNumber}>{number}</span>
                <h2 style={styles.sectionTitle}>{title}</h2>
              </div>

              <div style={{ ...styles.sectionBody, paddingLeft: isMobile ? 0 : '30px' }}>
                {content.map((block, j) => {
                  if (block.type === 'p') {
                    return <p key={j} style={styles.bodyText}>{block.text}</p>
                  }
                  if (block.type === 'node') {
                    return <p key={j} style={styles.bodyText}>{block.node}</p>
                  }
                  if (block.type === 'callout') {
                    return (
                      <div key={j} style={styles.callout}>
                        <p style={styles.calloutText}>{block.text}</p>
                      </div>
                    )
                  }
                  if (block.type === 'bullets') {
                    return (
                      <div key={j}>
                        {block.title && <p style={styles.bulletsTitle}>{block.title}</p>}
                        <ul style={styles.bulletList}>
                          {block.items.map((item, k) => (
                            <li key={k} style={styles.bulletItem}>
                              <span style={styles.bulletDot} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  if (block.type === 'phrases') {
                    return (
                      <div key={j} style={styles.phrasesGrid}>
                        {block.items.map((phrase, k) => (
                          <div key={k} style={{
                            ...styles.phraseRow,
                            gridTemplateColumns: isMobile ? '130px 1fr' : '150px 190px 1fr',
                            borderBottom: k === block.items.length - 1 ? 'none' : '1px solid var(--color-n200)',
                          }}>
                            <span style={styles.phraseLocal}>{phrase.local}</span>
                            {!isMobile && <span style={styles.phrasePhonetic}>{phrase.phonetic}</span>}
                            <span style={styles.phraseMeaning}>{phrase.meaning}</span>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </section>
          ))}

          {/* Plan the rest — the pre-trip reading cluster */}
          <div style={styles.planRest}>
            <span style={styles.planRestLabel}>Plan the rest</span>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 32 }}>
              <Link to="/practical-info" style={styles.planRestLink}>
                Practical info — money, SIMs, getting around <ArrowRight size={15} style={{ verticalAlign: '-2px' }} />
              </Link>
              <Link to="/safe-travels" style={styles.planRestLink}>
                Safe travels — how we look after you <ArrowRight size={15} style={{ verticalAlign: '-2px' }} />
              </Link>
            </div>
          </div>

          {/* CTA — quiet hairline row */}
          <div style={{
            ...styles.cta,
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <div>
              <p style={styles.ctaTitle}>Ready to see it for yourself?</p>
              <p style={styles.ctaSubtitle}>
                A guide who knows the context makes every street and every story mean something.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button to="/tours" variant="secondary">Browse tours</Button>
              <Button to="/contact" variant="secondary">Ask a question</Button>
            </div>
          </div>

        </article>
      </div>
    </div>
  )
}

const styles = {
  sectionHeader: { display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '18px' },
  sectionNumber: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: '15px', color: 'var(--color-amber)', flexShrink: 0 },
  sectionTitle: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: 'clamp(21px, 2.8vw, 26px)', color: 'var(--color-n900)', margin: 0, lineHeight: 1.25, letterSpacing: '-0.01em' },
  sectionBody: { display: 'flex', flexDirection: 'column', gap: '16px' },
  bodyText: { fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-n700)', lineHeight: '1.8', margin: 0 },

  callout: { borderLeft: '2px solid var(--color-amber)', backgroundColor: 'var(--color-n100)', borderRadius: '0 10px 10px 0', padding: '14px 18px' },
  calloutText: { fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--color-n700)', lineHeight: '1.75', margin: 0, fontStyle: 'italic' },

  bulletsTitle: { fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '14px', color: 'var(--color-n800)', margin: '0 0 10px 0' },
  bulletList: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' },
  bulletItem: { fontFamily: 'var(--font-body)', fontSize: '15.5px', color: 'var(--color-n700)', lineHeight: '1.7', display: 'flex', alignItems: 'flex-start', gap: '10px' },
  bulletDot: { width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-forest-green)', flexShrink: 0, marginTop: '9px' },

  phrasesGrid: { display: 'flex', flexDirection: 'column', margin: '4px 0' },
  phraseRow: { display: 'grid', gap: '12px', padding: '11px 0', alignItems: 'baseline' },
  phraseLocal: { fontFamily: 'var(--font-hero)', fontWeight: 500, fontSize: '18px', color: 'var(--color-forest-green)' },
  phrasePhonetic: { fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-n500)', fontStyle: 'italic' },
  phraseMeaning: { fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--color-n700)' },

  planRest: { marginTop: '56px', paddingTop: '28px', borderTop: '1px solid var(--color-n200)' },
  planRestLabel: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-forest-green)', marginBottom: 14 },
  planRestLink: { fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--color-n900)', textDecoration: 'none' },

  cta: {
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '1px solid var(--color-n200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  },
  ctaTitle: { fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '18px', color: 'var(--color-n900)', margin: '0 0 4px 0' },
  ctaSubtitle: { fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', margin: 0, lineHeight: '1.6' },
}

export default BosniaCulturalGuide
