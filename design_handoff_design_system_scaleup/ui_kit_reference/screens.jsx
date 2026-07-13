const { useState: useStateS } = React;
const { Icons: IconsS } = window;

// ─── TourDetail ─────────────────────────────────
window.TourDetail = function TourDetail({ tour, onBack, onBook }) {
  return (
    <div style={{ background: 'var(--color-n100)' }}>
      <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
        <img src={tour.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,20,15,0.3) 0%, rgba(10,20,15,0.75) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 40px 56px', color: '#fff', maxWidth: 1100, margin: '0 auto' }}>
          <a onClick={onBack} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, cursor: 'pointer', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back to all tours</a>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 500, marginBottom: 18, alignSelf: 'flex-start' }}>
            <IconsS.MapPin size={13} color="var(--color-amber)" /> Sarajevo, Bosnia
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, margin: 0, lineHeight: 1.1, maxWidth: 720 }}>{tour.title}</h1>
          <div style={{ display: 'flex', gap: 24, marginTop: 20, fontSize: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><IconsS.Star size={15} color="var(--color-amber)" fill="var(--color-amber)" /> <b>{tour.rating}</b> ({tour.reviews} reviews)</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><IconsS.Clock size={15} /> {tour.duration}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><IconsS.Users size={15} /> Max {tour.maxGuests} people</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 40px 96px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-forest-green)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 14 }}>Overview</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, margin: 0, color: 'var(--fg-1)' }}>The real Mostar, with a local who grew up here.</h2>
          <p style={{ fontSize: 16, color: 'var(--fg-2)', lineHeight: 1.75, marginTop: 18 }}>
            We drive down through Konjic and the Neretva canyon, stop at a hidden viewpoint most tour buses never see, and reach Mostar in time for lunch on the terrace overlooking the Old Bridge. The afternoon is yours — I'll walk you through the Ottoman quarter and the stories most guides skip.
          </p>
          <div style={{ marginTop: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-forest-green)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 20 }}>What's Included</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {['Transport from Sarajevo', 'Licensed local guide', 'Stops at Konjic & viewpoint', 'Old Bridge walking tour', 'Lunch recommendations', 'Return by 18:00'].map(x => (
                <div key={x} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--fg-1)' }}>
                  <IconsS.CheckCircle size={18} color="var(--color-forest-green)" /> {x}
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside style={{ background: '#fff', border: '1px solid var(--color-n300)', borderRadius: 12, padding: 28, height: 'fit-content', position: 'sticky', top: 88, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--fg-1)' }}>€{tour.price}</span>
            <span style={{ fontSize: 14, color: 'var(--fg-2)' }}>/person</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>Free cancellation · Confirmed within 24h</div>
          <div style={{ height: 1, background: 'var(--color-n300)', margin: '22px 0' }} />
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
          <input type="date" style={{ width: '100%', height: 44, marginTop: 8, padding: '0 14px', border: '1px solid var(--color-n300)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 14, background: '#fff' }} />
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginTop: 16 }}>Guests</label>
          <select style={{ width: '100%', height: 44, marginTop: 8, padding: '0 14px', border: '1px solid var(--color-n300)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 14, background: '#fff' }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n} {n===1?'person':'people'}</option>)}
          </select>
          <a onClick={onBook} style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
            height: 52, background: 'var(--color-amber)', color: 'var(--color-n900)',
            fontWeight: 700, fontSize: 16, borderRadius: 8, marginTop: 22, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(244,161,48,0.2)'
          }}>Request to Book <IconsS.ArrowRight size={18} color="currentColor" /></a>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            No payment yet. You'll hear back within 24 hours.
          </div>
        </aside>
      </div>
    </div>
  );
};

// ─── ContactForm ────────────────────────────────
window.ContactForm = function ContactForm() {
  const [sent, setSent] = useStateS(false);
  return (
    <div style={{ background: 'var(--color-n100)' }}>
      <div style={{ background: 'var(--color-forest-green)', padding: '80px 40px 80px', color: '#fff', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-mid-green)', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 14 }}>Get In Touch</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, margin: 0, lineHeight: 1.15, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>Have a question? Ready to book? Let's chat.</h1>
        <p style={{ fontSize: 17, color: 'var(--color-amber-light)', marginTop: 18, lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>You'll hear back within 24 hours. Usually much sooner.</p>
      </div>
      <div style={{ maxWidth: 580, margin: '-40px auto 96px', padding: '0 40px', position: 'relative' }}>
        <div style={{ background: '#fff', border: '1px solid var(--color-n300)', borderRadius: 12, padding: 36, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,125,94,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <IconsS.CheckCircle size={32} color="var(--color-forest-green)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--fg-1)' }}>Message received.</h3>
              <p style={{ fontSize: 15, color: 'var(--fg-2)', marginTop: 12, lineHeight: 1.6 }}>You'll hear back within 24 hours.</p>
            </div>
          ) : (
            <>
              {[['Full Name', 'Amina Begović', 'text'], ['Email', 'you@example.com', 'email']].map(([lbl, ph, type]) => (
                <div key={lbl} style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 8 }}>{lbl}</label>
                  <input type={type} placeholder={ph} style={{ width: '100%', height: 46, padding: '0 14px', border: '1px solid var(--color-n300)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 14, background: '#fff', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 8 }}>Message</label>
                <textarea placeholder="Tell me what you're hoping to see..." rows={5} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--color-n300)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 14, background: '#fff', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <a onClick={() => setSent(true)} style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
                height: 52, background: 'var(--color-amber)', color: 'var(--color-n900)',
                fontWeight: 700, fontSize: 16, borderRadius: 8, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(244,161,48,0.2)'
              }}>Send Message <IconsS.ArrowRight size={18} color="currentColor" /></a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
