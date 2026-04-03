import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import Packages from './pages/Packages'
import Contact from './pages/Contact'
import PackageDetail from './pages/PackageDetail'
import PersonalisedTour from './pages/PersonalisedTour'
import About from './pages/About'
import { Link } from 'react-router-dom'

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
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/personalised" element={<PersonalisedTour />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      <ScrollToTopButton />
    </div>
  )
}

export default App