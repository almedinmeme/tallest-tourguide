import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LocalBusinessSchema } from './schema/SchemaMarkup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import WhatsAppButton from './components/WhatsAppButton'
import { Link } from 'react-router-dom'

const Home           = lazy(() => import('./pages/Home'))
const Tours          = lazy(() => import('./pages/Tours'))
const TourDetail     = lazy(() => import('./pages/TourDetail'))
const Packages       = lazy(() => import('./pages/Packages'))
const Contact        = lazy(() => import('./pages/Contact'))
const PackageDetail  = lazy(() => import('./pages/PackageDetail'))
const PersonalisedTour = lazy(() => import('./pages/PersonalisedTour'))
const About          = lazy(() => import('./pages/About'))
const Blog           = lazy(() => import('./pages/Blog'))
const BlogPost       = lazy(() => import('./pages/BlogPost'))
const LeaveReview       = lazy(() => import('./pages/LeaveReview'))
const BookingConditions = lazy(() => import('./pages/BookingConditions'))
const SafeTravels       = lazy(() => import('./pages/SafeTravels'))
const PracticalInfo        = lazy(() => import('./pages/PracticalInfo'))
const BosniaCulturalGuide  = lazy(() => import('./pages/BosniaCulturalGuide'))

function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 40px',
      textAlign: 'center',
      backgroundColor: 'var(--color-n100)',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: '700',
        fontSize: '72px',
        color: 'var(--color-n300)',
        lineHeight: 1,
        marginBottom: '16px',
      }}>404</span>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: '700',
        fontSize: '28px',
        color: 'var(--color-n900)',
        marginBottom: '12px',
      }}>Page not found</h1>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '16px',
        color: 'var(--color-n600)',
        marginBottom: '32px',
        maxWidth: '360px',
        lineHeight: '1.6',
      }}>
        This page doesn't exist. It might have moved, or the link could be incorrect.
      </p>
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '48px',
        padding: '0 28px',
        backgroundColor: 'var(--color-forest-green)',
        color: 'var(--color-n000)',
        fontFamily: 'var(--font-body)',
        fontWeight: '700',
        fontSize: '15px',
        borderRadius: 'var(--radius)',
        textDecoration: 'none',
      }}>
        Back to Home
      </Link>
    </div>
  )
}

function App() {
  return (
    <div>
      {/* LocalBusinessSchema renders a <script> tag in <head> on every page.
          It tells Google this is a real local business in Sarajevo.
          Invisible to visitors — only read by search engines. */}
      <LocalBusinessSchema />

      <Navbar />

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:slug" element={<TourDetail />} />
          <Route path="/multi-day-tours" element={<Packages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
          <Route path="/personalised" element={<PersonalisedTour />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/review/:slug" element={<LeaveReview />} />
          <Route path="/booking-conditions" element={<BookingConditions />} />
          <Route path="/safe-travels" element={<SafeTravels />} />
          <Route path="/practical-info" element={<PracticalInfo />} />
          <Route path="/bosnia-guide" element={<BosniaCulturalGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />

      <ScrollToTopButton />
      <WhatsAppButton />
    </div>
  )
}

export default App