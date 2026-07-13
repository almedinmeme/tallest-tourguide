const { useState } = React;
const { Icons } = window;

// ─── Navbar ─────────────────────────────────────
// Live IA: Where to Go · Day Tours · Journeys · The Journal · Discover
// CTA is the canonical PRIMARY button (amber fill, 8px radius, sm size).
window.Navbar = function Navbar({ active, onNav }) {
  const items = [
    { label: 'Where to Go', screen: 'Tours', caret: true },
    { label: 'Day Tours',   screen: 'Tours', caret: true },
    { label: 'Journeys',    screen: 'Packages', caret: true },
    { label: 'The Journal', screen: 'Journal' },
    { label: 'Discover',    screen: 'About', caret: true },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100, background: '#fff',
      borderBottom: '1px solid var(--color-n300)', height: 72,
      display: 'flex', alignItems: 'center', padding: '0 40px'
    }}>
      <a onClick={() => onNav('Home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <img src="../../assets/logo.svg" style={{ height: 40 }} />
      </a>
      <nav style={{ display: 'flex', gap: 2, marginLeft: 44, flex: 1 }}>
        {items.map(item => {
          const on = active === item.screen;
          return (
            <a key={item.label} onClick={() => onNav(item.screen)} style={{
              fontSize: 14, height: 44, padding: '0 15px',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontWeight: on ? 700 : 500,
              color: on ? 'var(--color-forest-green)' : 'var(--fg-2)',
              background: on ? 'rgba(46,125,94,0.09)' : 'transparent',
              borderRadius: 100, cursor: 'pointer',
            }}>
              {item.label}{item.caret && <span style={{ opacity: .55, fontSize: 11 }}>⌄</span>}
            </a>
          );
        })}
      </nav>
      <a onClick={() => onNav('Contact')} style={{
        height: 44, padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--color-amber)', color: 'var(--color-n900)',
        borderRadius: 'var(--radius)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(244,161,48,0.25)',
      }}>
        Plan Your Trip
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </header>
  );
};

// ─── Hero ───────────────────────────────────────
window.Hero = function Hero({ onCTA }) {
  return (
    <section style={{ position: 'relative', height: 620, overflow: 'hidden', color: '#fff' }}>
      <img src="../../assets/hero-bg.webp" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, rgba(10,20,15,0.92) 0%, rgba(10,20,15,0.75) 40%, rgba(10,20,15,0.2) 70%, transparent 100%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 30%)'
      }} />
      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '100px 40px 0' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100,
          padding: '8px 16px', fontSize: 13, fontWeight: 500, marginBottom: 28,
        }}>
          <Icons.MapPin size={14} color="var(--color-amber)" /> Sarajevo, Bosnia & Herzegovina
        </div>
        <h1 style={{ fontFamily: 'var(--font-hero)', margin: 0, fontSize: 64, lineHeight: 1.05, maxWidth: 780 }}>
          <span style={{ fontWeight: 300, fontStyle: 'italic', opacity: 0.9, display: 'block' }}>You Won't Just See Bosnia.</span>
          <span style={{ fontWeight: 800, display: 'block' }}>You'll Understand It.</span>
        </h1>
        <p style={{
          maxWidth: 540, marginTop: 24, fontSize: 18, lineHeight: 1.6,
          color: 'var(--color-amber-light)',
        }}>Small groups. Local knowledge. Fourteen years guiding travellers through the real Balkans — not the postcard version.</p>
        <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
          <a onClick={() => onCTA('Tours')} style={{
            height: 52, padding: '0 28px', background: 'var(--color-amber)', color: 'var(--color-n900)',
            fontWeight: 700, fontSize: 16, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: '0 2px 8px rgba(244,161,48,0.2)', cursor: 'pointer'
          }}>Explore Tours <Icons.ArrowRight size={18} color="currentColor" /></a>
          <a onClick={() => onCTA('Personalised')} style={{
            height: 52, padding: '0 24px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            color: '#fff', fontWeight: 600, fontSize: 15, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8,
            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
          }}><Icons.Sparkles size={16} color="var(--color-amber)" /> Plan a Full Trip</a>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase'
      }}>
        Scroll <Icons.ChevronDown size={16} color="currentColor" />
      </div>
    </section>
  );
};

// ─── TrustBar ───────────────────────────────────
window.TrustBar = function TrustBar() {
  const items = [
    { icon: <Icons.Star size={18} color="var(--color-amber)" fill="var(--color-amber)" />, label: 'TripAdvisor', value: '4.9 out of 5' },
    { icon: <Icons.Users size={18} color="var(--color-forest-green)" />, label: 'Happy Guests', value: '5000+ guided' },
    { icon: <Icons.UserCheck size={18} color="var(--color-forest-green)" />, label: 'Group Size', value: 'Max 12 people' },
    { icon: <Icons.ShieldCheck size={18} color="var(--color-forest-green)" />, label: 'Cancellation', value: '24 hours before' },
  ];
  return (
    <div style={{
      maxWidth: 1000, margin: '0 auto', padding: '0 40px',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        background: '#fff', border: '1px solid var(--color-n300)', borderRadius: 12,
        padding: '22px 12px', marginTop: -40, position: 'relative', zIndex: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center',
            borderRight: i < 3 ? '1px solid var(--color-n300)' : 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'var(--color-n100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--fg-2)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginTop: 2 }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
