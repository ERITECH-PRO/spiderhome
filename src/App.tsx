import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
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
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Composant pour l'interface admin (sans Header ni Footer)
const AdminApp = () => {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Routes publiques avec Header et Footer */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="fonctionnalites" element={<Features />} />
            <Route path="produits" element={<Products />} />
            <Route path="produits/:slug" element={<ProductDetail />} />
            <Route path="a-propos" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          
          {/* Routes admin sans Header ni Footer */}
          <Route path="/admin" element={<AdminApp />}>
            <Route index element={<Navigate to="/admin/login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/products" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/products/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/products/:id/edit" element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/slides" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Slides />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/slides/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <SlideForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/slides/:id/edit" element={
              <ProtectedRoute>
                <AdminLayout>
                  <SlideForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/blog" element={
              <ProtectedRoute>
                <AdminLayout>
                  <BlogAdmin />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/blog/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/blog/:id/edit" element={
              <ProtectedRoute>
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/features" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminFeatures />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="dashboard/features/new" element={
              <ProtectedRoute>
                <AdminLayout>
                  <FeatureForm />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;