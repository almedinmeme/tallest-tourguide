import { useState, useEffect, useRef } from 'react'
import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import useWindowWidth from '../hooks/useWindowWidth'

const NAVBAR_HEIGHT = 68

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
        type: 'callout',
        text: 'Landmines remain in rural and mountainous areas — a legacy of the war that will take decades to fully clear. This is not a concern in Sarajevo or on any standard tourist route. If hiking off-trail in rural areas, stay on marked paths and heed warning signs.',
      },
      {
        type: 'p',
        text: 'Emergency numbers: 112 (general), 122 (police), 124 (ambulance). Keep travel insurance details accessible.',
      },
    ],
  },
]

function StickyNav({ activeId, onScrollTo, isMobile }) {
  const [navbarVisible, setNavbarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) {
        setNavbarVisible(true)
      } else if (y > lastScrollY.current) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'sticky',
      top: navbarVisible ? `${NAVBAR_HEIGHT}px` : '0px',
      transition: 'top 0.3s ease',
      zIndex: 95,
      backgroundColor: 'var(--color-n000)',
      borderBottom: '1px solid var(--color-n300)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        height: '44px',
        maxWidth: '1060px',
        margin: '0 auto',
        padding: isMobile ? '0 16px' : '0 40px',
        minWidth: 'max-content',
      }}>
        {sections.map(({ id, number, title }) => {
          const isActive = activeId === id
          return (
            <button
              key={id}
              onClick={() => onScrollTo(id)}
              style={{
                height: '100%',
                padding: isMobile ? '0 10px' : '0 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: isActive ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ fontSize: '10px', color: isActive ? 'var(--color-forest-green)' : 'var(--color-n400)', fontWeight: '600' }}>{number}</span>
              {title}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

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

  return (
    <div style={{ backgroundColor: 'var(--color-n100)', minHeight: '100vh' }}>
      <SEO
        title="Good Things to Know About Bosnia — Tallest Tourguide"
        description="A practical and cultural guide for visitors to Bosnia: visas, currency, food, religion, the political structure, the war, what not to say, and how Bosnians feel about tourists."
        url="/bosnia-guide"
        image="https://tallesttourguide.com/og-image.jpg"
      />

      {/* ── HEADER ── */}
      <section style={{
        backgroundColor: 'var(--color-forest-green)',
        padding: isMobile ? '36px 24px 44px' : '48px 40px 56px',
      }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <span style={styles.eyebrow}>Before You Go</span>
          <h1 style={{ ...styles.headline, fontSize: isMobile ? '30px' : '40px' }}>
            Good things to know about Bosnia
          </h1>
          <p style={styles.subheading}>
            Not a logistics checklist. A genuine guide to the country you are about to visit —
            its food, politics, history, and people.
          </p>
          <div style={styles.headerMeta}>
            <span style={styles.headerMetaItem}>10 topics</span>
            <span style={styles.headerMetaDot}>·</span>
            <span style={styles.headerMetaItem}>10 min read</span>
            <span style={styles.headerMetaDot}>·</span>
            <span style={styles.headerMetaItem}>Written by your guide</span>
          </div>
        </div>
      </section>

      {/* ── STICKY NAV ── */}
      <StickyNav activeId={activeId} onScrollTo={scrollTo} isMobile={isMobile} />

      {/* ── ARTICLE ── */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: isMobile ? '32px 20px 72px' : '48px 40px 96px',
      }}>
        <article style={styles.article}>

          {sections.map(({ id, number, title, content }, idx) => (
            <section
              key={id}
              id={id}
              style={{
                ...styles.section,
                borderTop: idx === 0 ? 'none' : '1px solid var(--color-n300)',
                paddingTop: idx === 0 ? 0 : '40px',
                marginTop: idx === 0 ? 0 : '40px',
              }}
            >
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNumber}>{number}</span>
                <h2 style={styles.sectionTitle}>{title}</h2>
              </div>

              <div style={styles.sectionBody}>
                {content.map((block, j) => {
                  if (block.type === 'p') {
                    return <p key={j} style={styles.bodyText}>{block.text}</p>
                  }
                  if (block.type === 'callout') {
                    return (
                      <div key={j} style={styles.callout}>
                        <div style={styles.calloutAccent} />
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
                            gridTemplateColumns: isMobile ? '120px 1fr' : '140px 180px 1fr',
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

          {/* ── CTA ── */}
          <div style={{
            ...styles.cta,
            flexDirection: isMobile ? 'column' : 'row',
            marginTop: '48px',
          }}>
            <div>
              <p style={styles.ctaTitle}>Ready to see it for yourself?</p>
              <p style={styles.ctaSubtitle}>
                A guide who knows the context makes every street and every story mean something.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, flexWrap: 'wrap' }}>
              <Link to="/tours" style={styles.ctaBtn} className="btn-lift btn-glow-green">Browse tours</Link>
              <Link to="/contact" style={styles.ctaBtnSecondary} className="btn-lift">Ask a question</Link>
            </div>
          </div>

        </article>
      </div>
    </div>
  )
}

const styles = {
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 12px 0',
    lineHeight: 1.15,
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: '1.65',
    margin: '0 0 20px 0',
    maxWidth: '560px',
  },

  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },

  headerMetaItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
  },

  headerMetaDot: {
    color: 'rgba(255,255,255,0.25)',
  },

  article: {
    minWidth: 0,
  },

  section: {
    scrollMarginTop: '120px',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '20px',
  },

  sectionNumber: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-forest-green)',
    opacity: 0.6,
    flexShrink: 0,
  },

  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '22px',
    color: 'var(--color-n900)',
    margin: 0,
    lineHeight: 1.25,
  },

  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingLeft: '28px',
  },

  bodyText: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n700)',
    lineHeight: '1.8',
    margin: 0,
  },

  callout: {
    display: 'flex',
    gap: '16px',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: 'var(--shadow-sm)',
  },

  calloutAccent: {
    width: '3px',
    borderRadius: '2px',
    backgroundColor: 'var(--color-forest-green)',
    flexShrink: 0,
    alignSelf: 'stretch',
  },

  calloutText: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n700)',
    lineHeight: '1.75',
    margin: 0,
    fontStyle: 'italic',
  },

  bulletsTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '14px',
    color: 'var(--color-n800)',
    margin: '0 0 10px 0',
  },

  bulletList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  bulletItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    color: 'var(--color-n700)',
    lineHeight: '1.7',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  bulletDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    flexShrink: 0,
    marginTop: '8px',
  },

  phrasesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },

  phraseRow: {
    display: 'grid',
    gap: '12px',
    padding: '12px 20px',
    borderBottom: '1px solid var(--color-n200)',
    alignItems: 'center',
  },

  phraseLocal: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-forest-green)',
  },

  phrasePhonetic: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n500)',
    fontStyle: 'italic',
  },

  phraseMeaning: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n700)',
  },

  cta: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '14px',
    padding: '28px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: 'var(--shadow-sm)',
  },

  ctaTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-n900)',
    margin: '0 0 4px 0',
  },

  ctaSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n600)',
    margin: 0,
    lineHeight: '1.6',
  },

  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'var(--color-forest-green)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '15px',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },

  ctaBtnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '15px',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    border: '1.5px solid var(--color-forest-green)',
  },
}

export default BosniaCulturalGuide
