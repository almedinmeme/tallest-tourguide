// PracticalInfo.jsx
// The useful, unglamorous pre-trip details, grouped into three clusters and
// set as open editorial lists (no card boxes). Ends by wiring the pre-trip
// reading cluster together: the Bosnia guide, where we stay, safe travels.
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from '../components/Button'
import InfoHero from '../components/InfoHero'
import {
  Banknote, CreditCard, Coffee, Car,
  Smartphone, Wifi, MessageSquare, BookOpen, Phone, ArrowRight,
} from 'lucide-react'

const CLUSTERS = [
  {
    num: '01',
    eyebrow: 'Money',
    heading: 'Marks, cards and tips',
    items: [
      {
        icon: Banknote,
        title: 'Currency',
        body: 'Bosnia uses the Convertible Mark (BAM, locally "KM"). The rate is fixed by law: 1 EUR = 1.95583 BAM — a mental shortcut: roughly 2 KM per euro. Cards are widely accepted in Sarajevo — smaller towns and local markets prefer cash. It is worth having some BAM on hand at all times.',
      },
      {
        icon: CreditCard,
        title: 'ATMs & cash — avoid the DCC trap',
        body: 'ATMs are plentiful throughout Sarajevo, including at the airport and the old town. One thing worth knowing: many ATMs and card machines will ask "charge in EUR or BAM?" — this is Dynamic Currency Conversion, and it almost always gives you a worse rate than your own bank. Always choose BAM; your bank converts at the real rate. Check your bank\'s international withdrawal fee before you travel.',
      },
      {
        icon: Coffee,
        title: 'Tipping',
        body: 'Tipping is not mandatory but genuinely appreciated. Around 10% in restaurants is standard, and rounding up is fine if you\'d rather keep it simple. Guide tips are never included in tour prices and are a meaningful gesture, not an expectation.',
      },
    ],
  },
  {
    num: '02',
    eyebrow: 'Getting around & staying connected',
    heading: 'Moving through the city',
    items: [
      {
        icon: Car,
        title: 'Getting around',
        body: 'Bolt is the easiest and most transparent way to get around Sarajevo — fares are fixed in-app, no negotiation needed. Street taxis exist, but agreeing a price upfront (or insisting on the meter) avoids the classic tourist markup. Trams and trolleybuses are cheap and cover the main routes; buy your ticket from a kiosk before boarding where possible. The old town (Baščaršija) is entirely walkable — most of what visitors want is within 15 minutes on foot.',
      },
      {
        icon: Smartphone,
        title: 'SIM cards',
        body: 'Three carriers cover the country: BH Telecom (strongest in Sarajevo and the Federation generally), m:tel (strongest in Republika Srpska — Banja Luka, Trebinje, the east), and HT Eronet (strongest around Mostar and Herzegovina). If your route includes both Sarajevo and Mostar, BH Telecom covers most of it, with a few weak patches on the drive between the two. Buying a physical SIM requires your passport — a legal requirement in Bosnia, not optional. Kiosks exist at Sarajevo Airport and throughout the centre; tourist data packages run roughly €5–20.',
      },
      {
        icon: Wifi,
        title: 'eSIM & roaming',
        body: 'If you\'d rather skip the kiosk line entirely, an eSIM activated before you land is a straightforward alternative for most modern phones — though data-only eSIMs won\'t give you a local phone number if you need one. EU citizens: your EU roaming plan does not cover Bosnia, since it isn\'t an EU or Schengen member. Check this before you arrive, not after the bill.',
      },
    ],
  },
  {
    num: '03',
    eyebrow: 'Culture & safety',
    heading: 'Fitting in, staying safe',
    items: [
      {
        icon: MessageSquare,
        title: 'Language',
        body: 'The official languages are Bosnian, Croatian, and Serbian — mutually intelligible, differing mainly by political label rather than substance. English is widely spoken in Sarajevo\'s hospitality sector, especially among anyone under 40. A few words go further than you\'d expect: hvala (thank you), dobar dan (good day), molim (please / you\'re welcome), izvolite (here you are), doviđenja (goodbye).',
      },
      {
        icon: BookOpen,
        title: 'Religious customs',
        body: 'Bosnia is religiously diverse — Muslim, Orthodox Christian, and Catholic communities all have a visible presence. When visiting mosques, remove your shoes and dress modestly (shoulders and knees covered). Friday midday prayer (Jumu\'ah) brings brief closures at active mosques — the exact time shifts with the season since it follows solar noon, so treat "around midday" as the rule rather than a fixed clock time.',
      },
      {
        icon: Phone,
        title: 'Emergency numbers',
        body: 'General emergency: 112. Police: 122. Ambulance: 124. Fire: 123. Sarajevo is a safe city by any normal European standard — the usual precautions (watch belongings in crowds, don\'t leave bags unattended) are all that\'s needed. Keep your travel insurance details and accommodation address accessible at all times, ideally saved offline on your phone in case you lose signal.',
      },
    ],
  },
]

const GO_DEEPER = [
  { to: '/bosnia-guide', label: 'The Bosnia travel guide', note: 'Food, politics, the war, what not to say' },
  { to: '/where-we-stay', label: 'Where we stay', note: 'Homestays, estates, boutique hotels' },
  { to: '/safe-travels', label: 'Safe travels', note: 'How we look after you — and your payment' },
]

function PracticalInfo() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  return (
    <main style={{ backgroundColor: 'var(--color-n000)' }}>
      <SEO
        title="Practical Info for Visiting Bosnia"
        description="Currency, ATMs, tipping, getting around, SIM cards, language basics, religious customs, and emergency numbers — the practical details for independent, small-group travellers in Sarajevo and Bosnia."
        url="/practical-info"
      />

      <InfoHero
        kicker="Before you go"
        title="Practical info"
        lede="The useful, unglamorous details — money, SIM cards, getting around, customs — so the small stuff never gets in the way of the good stuff."
        chips={['1 EUR = 1.95583 BAM — fixed', 'Bolt taxis work well', 'English widely spoken', 'Emergency: 112']}
      />

      {/* Clusters — open lists, no boxes */}
      <section style={{ padding: isMobile ? '44px 24px 8px' : '60px 24px 16px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          {CLUSTERS.map((cluster, ci) => (
            <div
              key={cluster.eyebrow}
              style={{
                paddingTop: ci === 0 ? 0 : isMobile ? 36 : 48,
                marginTop: ci === 0 ? 0 : isMobile ? 36 : 48,
                borderTop: ci === 0 ? 'none' : '1px solid var(--color-n200)',
              }}
            >
              <span style={styles.clusterNum}>{cluster.num}</span>
              <span style={styles.eyebrow}>{cluster.eyebrow}</span>
              <h2 style={styles.h2}>{cluster.heading}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 26 : '32px 64px', marginTop: 28 }}>
                {cluster.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <Icon size={20} color="var(--color-forest-green)" strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 3 }} />
                      <div>
                        <h3 style={styles.itemTitle}>{item.title}</h3>
                        <p style={styles.itemBody}>{item.body}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Paying for your trip — quiet band pointing at the conditions */}
      <section style={{ padding: isMobile ? '44px 24px' : '60px 24px' }}>
        <div style={styles.payBand}>
          <p style={styles.payText}>
            Booking a multi-day trip means sending real money to a small company in another
            country — we get it. Here's exactly how payment, deposits and refunds work.
          </p>
          <Link to="/booking-conditions" style={styles.payLink}>
            Payments &amp; booking conditions <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Go deeper — the pre-trip reading cluster */}
      <section style={{ padding: isMobile ? '8px 24px 40px' : '8px 24px 56px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <span style={styles.eyebrow}>Go deeper</span>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 4 : 32, marginTop: 16 }}>
            {GO_DEEPER.map((link) => (
              <Link key={link.to} to={link.to} style={styles.deepLink}>
                <span style={styles.deepLabel}>{link.label} <ArrowRight size={15} style={{ verticalAlign: '-2px' }} /></span>
                <span style={styles.deepNote}>{link.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* End CTA */}
      <section style={{ padding: '16px 24px 96px', textAlign: 'center' }}>
        <Button to="/contact" variant="secondary" size="lg" arrow>
          Ask us before you arrive
        </Button>
        <p style={styles.ctaNote}>We know Sarajevo inside out.</p>
      </section>
    </main>
  )
}

const styles = {
  clusterNum: { display: 'block', fontFamily: 'var(--font-hero)', fontSize: 15, fontWeight: 500, color: 'var(--color-amber)', letterSpacing: 1, marginBottom: 10 },

  eyebrow: { display: 'block', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-forest-green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 },
  h2: { fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(22px, 3vw, 30px)', color: 'var(--color-n900)', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 },

  itemTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-n900)', margin: '0 0 6px', lineHeight: 1.3 },
  itemBody: { fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.75, color: 'var(--color-n600)', margin: 0 },

  payBand: {
    maxWidth: 1080,
    margin: '0 auto',
    backgroundColor: 'var(--color-n100)',
    borderLeft: '3px solid var(--color-amber)',
    borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
    padding: 'clamp(22px, 3.5vw, 32px)',
  },
  payText: { fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.7, color: 'var(--color-n700)', margin: '0 0 12px', maxWidth: 640 },
  payLink: { display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--color-forest-green)', textDecoration: 'none' },

  deepLink: { display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 0', textDecoration: 'none', borderBottom: '1px solid var(--color-n200)' },
  deepLabel: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-n900)' },
  deepNote: { fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--color-n500)' },

  ctaNote: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-n500)', marginTop: 16 },
}

export default PracticalInfo
