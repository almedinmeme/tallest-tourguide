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
      </Routes>

      <Footer />

      {/* Floating scroll to top button —
          appears after 50% scroll, fixed position,
          visible on every page automatically. */}
      <ScrollToTopButton />
    </div>
  )
}

export default App
