const { useState: useStateC } = React;
const { Icons: IconsC } = window;

// ─── SectionHeader ──────────────────────────────
window.SectionHeader = function SectionHeader({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div style={{ textAlign: align, maxWidth: 640, margin: align === 'center' ? '0 auto' : undefined, marginBottom: 48 }}>
      <div style={{
        fontSize: 13, fontWeight: 500, color: 'var(--color-forest-green)',
        textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 14,
      }}>{eyebrow}</div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700,
        color: 'var(--fg-1)', margin: 0, lineHeight: 1.2,
      }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 17, color: 'var(--fg-2)', marginTop: 14, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
};

// ─── TourCard ───────────────────────────────────
window.TourCard = function TourCard({ tour, onClick }) {
  const [hover, setHover] = useStateC(false);
  return (
    <a onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      display: 'block', background: '#fff', borderRadius: 12, overflow: 'hidden',
      border: '1px solid var(--color-n300)', cursor: 'pointer',
      boxShadow: hover ? '0 12px 40px rgba(0,0,0,0.16)' : '0 2px 16px rgba(0,0,0,0.08)',
      transform: hover ? 'translateY(-6px)' : 'translateY(0)',
      transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <img src={tour.image} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s ease',
        }} />
        {tour.badge && (
          <span style={{
            position: 'absolute', top: 12, left: 12, background: 'var(--color-forest-green)',
            color: '#fff', fontWeight: 700, fontSize: 10, letterSpacing: '1.5px',
            textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4,
          }}>{tour.badge}</span>
        )}
        <div style={{
          position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', borderRadius: 6, padding: '6px 12px',
          display: 'flex', alignItems: 'baseline', gap: 3
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff' }}>€{tour.price}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>/person</span>
        </div>
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <IconsC.Star size={14} color="var(--color-amber)" fill="var(--color-amber)" />
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg-1)' }}>{tour.rating}</span>
          <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>({tour.reviews} reviews)</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--fg-1)', margin: 0, lineHeight: 1.3 }}>{tour.title}</h3>
        <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 13, color: 'var(--fg-2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><IconsC.Clock size={13} /> {tour.duration}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><IconsC.Users size={13} /> Max {tour.maxGuests}</span>
        </div>
        <div style={{ borderTop: '1px solid var(--color-n300)', margin: '14px 0 12px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {tour.languages.map((f, i) => (
              <span key={i} style={{
                width: 26, height: 26, borderRadius: '50%', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', background: 'var(--color-n100)',
                border: '1px solid var(--color-n300)', fontSize: 13,
              }}>{f}</span>
            ))}
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 4px',
            borderRadius: 'var(--radius)',
            background: 'transparent',
            color: 'var(--color-forest-green)',
            fontWeight: 700, fontSize: 13, letterSpacing: '0.2px',
            borderBottom: hover ? '1.5px solid var(--color-forest-green)' : '1.5px solid transparent',
            transition: 'all 0.25s ease',
          }}>View Tour <IconsC.ArrowRight size={13} color="currentColor" /></span>
        </div>
      </div>
    </a>
  );
};

// ─── CTABanner ──────────────────────────────────
window.CTABanner = function CTABanner({ onCTA }) {
  return (
    <section style={{
      padding: '96px 40px', background: 'var(--color-mint-wash)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(46,125,94,0.08) 0%, transparent 60%)'
      }} />
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-forest-green)', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 18 }}>Ready When You Are</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, margin: 0, lineHeight: 1.15, color: 'var(--fg-1)' }}>Your next great story starts here.</h2>
        <p style={{ fontSize: 17, color: 'var(--fg-2)', marginTop: 18, lineHeight: 1.6 }}>Small groups. Local knowledge. No two tours the same.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <a onClick={() => onCTA('Tours')} style={{
            height: 52, padding: '0 28px', background: 'var(--color-amber)', color: 'var(--color-n900)',
            fontWeight: 700, fontSize: 16, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 10,
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(244,161,48,0.2)'
          }}>Explore Tours <IconsC.ArrowRight size={18} color="currentColor" /></a>
          <a onClick={() => onCTA('Contact')} style={{
            height: 52, padding: '0 24px', background: 'transparent', color: 'var(--color-forest-green)',
            fontWeight: 600, fontSize: 15, borderRadius: 8, border: '1.5px solid var(--color-forest-green)',
            display: 'inline-flex', alignItems: 'center', cursor: 'pointer'
          }}>Contact Us</a>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 26, fontSize: 13, color: 'var(--fg-2)' }}>
          <span>✓ Free cancellation</span>
          <span>✓ Confirmed within 24h</span>
          <span>✓ Small groups only</span>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ─────────────────────────────────────
window.Footer = function Footer() {
  return (
    <footer style={{ background: 'var(--color-deep-green)', color: '#fff', position: 'relative' }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--color-amber), transparent)' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <img src="../../assets/logo.svg" style={{ height: 56, opacity: 0.95 }} />
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7, marginTop: 18, maxWidth: 280 }}>
              Local knowledge. Small groups. Real Bosnia and Herzegovina. Raw Balkan.
            </p>
          </div>
          {[
            { title: 'Explore', links: ['Home', 'Our Tours', 'Packages', 'Personalised Tour'] },
            { title: 'Company', links: ['About', 'Blog', 'Reviews', 'Contact'] },
            { title: 'Get in Touch', links: ['hello@tallesttourguide.com', '+387 33 000 000', 'Sarajevo, BiH'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 18 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(l => <li key={l}><a style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, cursor: 'pointer' }}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 48, paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)'
        }}>
          <span>© 2026 Tallest Tourguide & Friends · Sarajevo</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500, cursor: 'pointer' }}>Instagram</a>
            <span style={{ opacity: 0.3 }}>·</span>
            <a style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500, cursor: 'pointer' }}>TripAdvisor</a>
            <span style={{ opacity: 0.3 }}>·</span>
            <a style={{ color: 'var(--color-amber)', fontWeight: 500, cursor: 'pointer' }}>WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
