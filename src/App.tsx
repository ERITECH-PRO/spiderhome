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
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductForm from './pages/admin/ProductForm';
import AdminSlides from './pages/admin/Slides';
import AdminSlideForm from './pages/admin/SlideForm';
import AdminBlog from './pages/admin/Blog';
import AdminBlogForm from './pages/admin/BlogForm';
import AdminFeatures from './pages/admin/Features';
import AdminFeatureForm from './pages/admin/FeatureForm';
import ProtectedRoute from './components/admin/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <HelmetProvider>
      <Router>
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
            
            {/* Routes Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="slides" element={<AdminSlides />} />
              <Route path="slides/new" element={<AdminSlideForm />} />
              <Route path="slides/:id/edit" element={<AdminSlideForm />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/new" element={<AdminBlogForm />} />
              <Route path="blog/:id/edit" element={<AdminBlogForm />} />
              <Route path="features" element={<AdminFeatures />} />
              <Route path="features/new" element={<AdminFeatureForm />} />
              <Route path="features/:id/edit" element={<AdminFeatureForm />} />
            </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;