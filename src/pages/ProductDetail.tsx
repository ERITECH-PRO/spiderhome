import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Download, ChevronLeft, ChevronRight, X, Home, Package, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';

interface Product {
  id: number;
  title: string;
  slug: string;
  reference: string;
  category: string;
  short_description: string;
  long_description: string;
  image_url: string;
  specifications: any;
  benefits: any;
  downloads: any;
  compatibility: any;
  related_products: any;
  is_new: boolean;
  featured: boolean;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (slug) {
        try {
          setLoading(true);
          const response = await fetch(`/api/products`);
          if (response.ok) {
            const products = await response.json();
            const foundProduct = products.find((p: Product) => p.slug === slug);
            if (foundProduct) {
              setProduct(foundProduct);
            } else {
              setProduct(null);
            }
          } else {
            setProduct(null);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du produit:', error);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#118AB2] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/produits" replace />;
  }

  return (
    <div className="pt-20">
      <SEO
        title={product.meta_title}
        description={product.meta_description}
        keywords={`${product.title}, ${product.reference}, SpiderHome, domotique, ${product.category}`}
        url={`/produits/${product.slug}`}
        type="product"
        product={{
          name: product.title,
          description: product.short_description,
          image: product.image_url || '',
          reference: product.reference,
          category: product.category
        }}
      />
      
      {/* Fil d'Ariane */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-[#118AB2] hover:text-[#EF476F] flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/produits" className="text-[#118AB2] hover:text-[#EF476F] flex items-center">
              <Package className="w-4 h-4 mr-1" />
              Produits
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#0B0C10]">{product.title}</span>
          </nav>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image du produit */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={product.image_url || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Badge Nouveau */}
                {product.is_new && (
                  <div className="absolute top-4 left-4 bg-[#EF476F] text-white text-sm px-3 py-1 rounded-full font-medium">
                    NOUVEAU
                  </div>
                )}
              </div>
            </div>

            {/* Informations produit */}
            <div className="space-y-6">
              {/* Titre et référence */}
              <div>
                <h1 className="text-3xl font-bold text-[#0B0C10] mb-2">
                  {product.title}
                </h1>
                <p className="text-lg text-[#118AB2] font-medium">
                  Référence: {product.reference}
                </p>
              </div>

              {/* Description courte */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.short_description}
              </p>

              {/* CTA Principal */}
              <div className="space-y-4">
                <Link
                  to="/contact"
                  className="block w-full bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 text-center"
                >
                  Demander une démo
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/contact"
                    className="flex items-center justify-center space-x-2 border-2 border-[#118AB2] text-[#118AB2] px-4 py-3 rounded-lg font-medium hover:bg-[#118AB2] hover:text-white transition-all duration-200"
                  >
                    <span>Contact</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  
                  <button className="flex items-center justify-center space-x-2 border-2 border-[#118AB2] text-[#118AB2] px-4 py-3 rounded-lg font-medium hover:bg-[#118AB2] hover:text-white transition-all duration-200">
                    <Download className="w-4 h-4" />
                    <span>Fiche PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description détaillée */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-[#0B0C10] mb-6">Description</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.long_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Sticky Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <Link
          to="/contact"
          className="block w-full bg-[#EF476F] text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-opacity-90 transition-colors"
        >
          Demander une démo
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;