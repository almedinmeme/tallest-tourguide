import SEO from '../components/SEO'
import { Link } from 'react-router-dom'
import useWindowWidth from '../hooks/useWindowWidth'
import {
  Banknote, CreditCard, Coffee, Car,
  Smartphone, MessageSquare, BookOpen, Phone,
} from 'lucide-react'

const cards = [
  {
    icon: Banknote,
    title: 'Currency',
    body: 'Bosnia uses the Convertible Mark (BAM / KM). The exchange rate is fixed: 1 EUR = 1.95583 BAM. Cards are widely accepted in Sarajevo — smaller towns and local markets prefer cash. It is worth having some BAM on hand at all times.',
  },
  {
    icon: CreditCard,
    title: 'ATMs & Cash',
    body: 'ATMs are plentiful throughout Sarajevo, including at the airport, in the old town, and along main shopping streets. You can withdraw BAM directly — no need to exchange euros first. Check your bank\'s international withdrawal fees before travelling.',
  },
  {
    icon: Coffee,
    title: 'Tipping',
    body: 'Tipping is not mandatory but it is appreciated. Around 10% in restaurants is standard. For guides, tips are always welcome and never included in the tour price — they are a meaningful way to show appreciation for a good experience.',
  },
  {
    icon: Car,
    title: 'Getting Around',
    body: 'The Bolt taxi app works well in Sarajevo and is the safest, most transparent option. Trams and trolleybuses are cheap and cover the main corridors. The old town (Baščaršija) is best explored entirely on foot — most of what you want is within easy walking distance.',
  },
  {
    icon: Smartphone,
    title: 'SIM Cards',
    body: 'BH Telecom and m:tel SIM cards are available at Sarajevo Airport and in mobile shops throughout the city. Both offer affordable data plans. EU citizens travelling with an EU SIM card should check whether their roaming package covers Bosnia — it is not an EU member state.',
  },
  {
    icon: MessageSquare,
    title: 'Language',
    body: 'The official languages are Bosnian, Croatian, and Serbian — they are mutually intelligible. English is widely spoken in Sarajevo, especially in hospitality and tourism. A few phrases go a long way: hvala (thank you), dobar dan (good day), molim (please / you\'re welcome), izvolite (here you are).',
  },
  {
    icon: BookOpen,
    title: 'Religious Customs',
    body: 'Bosnia is religiously diverse — Muslim, Orthodox Christian, and Catholic communities all have a visible presence. When visiting mosques, remove your shoes and dress modestly (shoulders and knees covered). Friday midday prayer means brief closures of some mosques between roughly 12:00 and 13:00.',
  },
  {
    icon: Phone,
    title: 'Emergency Numbers',
    body: 'General emergency: 112. Police: 122. Ambulance: 124. Fire: 123. Sarajevo is a safe city and standard European travel precautions apply. Keep a copy of your travel insurance details and your accommodation address accessible at all times.',
  },
]

function PracticalInfo() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const isTablet = width > 768 && width <= 1024
  const cols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)'

  return (
    <div style={{ backgroundColor: 'var(--color-n100)', minHeight: '100vh' }}>
      <SEO
        title="Practical Info — Tallest Tourguide"
        description="Currency, ATMs, tipping, getting around, SIM cards, language basics, religious customs, and emergency numbers for Sarajevo and Bosnia."
      />

      {/* Header */}
      <section style={styles.pageHeader}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <span style={styles.eyebrow}>Before You Go</span>
          <h1 style={styles.headline}>Practical Info</h1>
          <p style={styles.subheading}>
            Everything you need to know before arriving — currency, getting around, customs, and more.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section style={{ padding: isMobile ? '40px 16px 64px' : '56px 40px 80px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '20px' }}>
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.title} style={styles.card}>
                  <div style={styles.iconWrap}>
                    <Icon size={20} color="var(--color-forest-green)" />
                  </div>
                  <h2 style={styles.cardTitle}>{card.title}</h2>
                  <p style={styles.cardBody}>{card.body}</p>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{
            ...styles.cta,
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <div>
              <p style={styles.ctaTitle}>Have a question we didn't cover?</p>
              <p style={styles.ctaSubtitle}>Ask us anything before you arrive — we know Sarajevo inside out.</p>
            </div>
            <Link to="/contact" style={styles.ctaBtn} className="btn-lift btn-glow-green">
              Get in Touch
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '36px 40px',
  },
  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '36px',
    color: '#fff',
    margin: '0 0 10px 0',
    lineHeight: 1.2,
  },
  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '520px',
  },
  card: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  iconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(46,125,94,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '17px',
    color: 'var(--color-n900)',
    margin: '0 0 10px 0',
    lineHeight: 1.3,
  },
  cardBody: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n600)',
    lineHeight: '1.75',
    margin: 0,
  },
  cta: {
    marginTop: '32px',
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
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
    fontSize: '17px',
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
    flexShrink: 0,
  },
}

export default PracticalInfo
