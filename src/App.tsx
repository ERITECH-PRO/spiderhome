import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
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
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Slides from './pages/admin/Slides';
import SlideForm from './pages/admin/SlideForm';
import BlogAdmin from './pages/admin/Blog';
import BlogForm from './pages/admin/BlogForm';
import AdminFeatures from './pages/admin/Features';
import FeatureForm from './pages/admin/FeatureForm';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
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
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/products" element={<AdminProducts />} />
                <Route path="/dashboard/products/new" element={<ProductForm />} />
                <Route path="/dashboard/products/:id/edit" element={<ProductForm />} />
                <Route path="/dashboard/slides" element={<Slides />} />
                <Route path="/dashboard/slides/new" element={<SlideForm />} />
                <Route path="/dashboard/slides/:id/edit" element={<SlideForm />} />
                <Route path="/dashboard/blog" element={<BlogAdmin />} />
                <Route path="/dashboard/blog/new" element={<BlogForm />} />
                <Route path="/dashboard/blog/:id/edit" element={<BlogForm />} />
                <Route path="/dashboard/features" element={<AdminFeatures />} />
                <Route path="/dashboard/features/new" element={<FeatureForm />} />
                <Route path="/dashboard/features/:id/edit" element={<FeatureForm />} />
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </ThemeProvider>
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