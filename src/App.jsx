import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import Packages from './pages/Packages'
import Contact from './pages/Contact'

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />

        {/* The colon before "id" is what makes this a URL parameter.
            React Router will match any URL like /tours/1, /tours/2, /tours/anything
            and make that value available inside the TourDetail component.
            This single route handles all six of your tours automatically. */}
        <Route path="/tours/:id" element={<TourDetail />} />

        <Route path="/packages" element={<Packages />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App