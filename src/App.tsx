import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import TestNavigation from './pages/TestNavigation';
import SimpleTest from './pages/SimpleTest';
import ScrollToTop from './components/ScrollToTop';

// Composant pour le site public (avec Header et Footer)
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fonctionnalites" element={<Features />} />
          <Route path="/produits" element={<Products />} />
          <Route path="/produits/:slug" element={<ProductDetail />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<TestNavigation />} />
          <Route path="/simple-test" element={<SimpleTest />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Composant pour l'interface admin (sans Header ni Footer)
const AdminApp = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold">Interface Admin - Test</h1>
      <p>Version simplifiée pour diagnostic</p>
      <div className="mt-4">
        <a href="/" className="text-blue-400 hover:text-blue-300">
          Retour au site public
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Routes publiques avec Header et Footer */}
          <Route path="/*" element={<PublicLayout />} />
          
          {/* Routes admin sans Header ni Footer */}
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;