import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Download, ChevronLeft, ChevronRight, X, Home, Package, ExternalLink, ZoomIn } from 'lucide-react';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';
import { getImageUrl } from '../config/config';

interface Product {
  id: number;
  title: string;
  slug: string;
  reference: string;
  category: string;
  short_description: string;
  long_description: string;
  image_url: string;
  images?: any[];
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Helper function to get all product images
  const getProductImages = () => {
    if (!product) return [];
    
    const images = [];
    
    // Add images from images array
    if (product.images && product.images.length > 0) {
      images.push(...product.images);
    }
    
    // Add image_url if it exists and is not already in images array
    if (product.image_url && !images.some(img => img.url === product.image_url)) {
      images.push({
        id: 'main',
        url: product.image_url,
        filename: product.image_url.split('/').pop() || 'image.jpg',
        originalName: product.title || 'Product image',
        size: 0
      });
    }
    
    return images;
  };

  const productImages = getProductImages();
  const currentImage = productImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

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

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showImageModal || productImages.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showImageModal, productImages.length]);

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
            <Link to="/" className="text-[#118AB2] hover:text-blue-700 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/produits" className="text-[#118AB2] hover:text-blue-700 flex items-center">
              <Package className="w-4 h-4 mr-1" />
              Produits
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#0B0C10]">{product.title}</span>
          </nav>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image du produit */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  {currentImage ? (
                    <img
                      src={getImageUrl(currentImage.url)}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/placeholder-product.jpg"
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => setShowImageModal(true)}
                      />
                    </div>
                  )}
                </div>
                
                {/* Navigation arrows for multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Zoom button */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                
                {/* Image counter */}
                {productImages.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {productImages.length}
                  </div>
                )}
                
                {/* Badge Nouveau */}
                {Boolean(product.is_new) && (
                  <div className="absolute top-6 left-6 bg-[#118AB2] text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                    NOUVEAU
                  </div>
                )}
              </div>
              
               {/* Thumbnail gallery */}
               {productImages.length > 1 && (
                 <div className="flex space-x-2 pb-2">
                   {/* Show first 2 images */}
                   {productImages.slice(0, 2).map((image, index) => (
                     <button
                       key={image.id}
                       onClick={() => setCurrentImageIndex(index)}
                       className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                         index === currentImageIndex
                           ? 'border-[#118AB2] shadow-lg'
                           : 'border-gray-200 hover:border-gray-300'
                       }`}
                     >
                       <img
                         src={getImageUrl(image.url)}
                         alt={`${product.title} - Image ${index + 1}`}
                         className="w-full h-full object-cover"
                       />
                     </button>
                   ))}
                   
                   {/* Show 3rd image with overflow indicator */}
                   {productImages.length >= 3 && (
                     <button
                       onClick={() => productImages.length > 3 ? setShowImageModal(true) : setCurrentImageIndex(2)}
                       className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                         2 === currentImageIndex
                           ? 'border-[#118AB2] shadow-lg'
                           : 'border-gray-200 hover:border-gray-300'
                       }`}
                     >
                       <img
                         src={getImageUrl(productImages[2].url)}
                         alt={`${product.title} - Image 3`}
                         className="w-full h-full object-cover"
                       />
                       
                       {/* Overflow overlay for 4+ images */}
                       {productImages.length > 3 && (
                         <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                           <span className="text-xs font-medium text-white">
                             +{productImages.length - 3}
                           </span>
                         </div>
                       )}
                     </button>
                   )}
                 </div>
               )}
            </div>

            {/* Informations produit */}
            <div className="space-y-8">
              {/* Titre et référence */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.title}
                </h1>
                {product.reference && product.reference !== "0" && (
                  <div className="inline-flex items-center space-x-2 bg-[#118AB2]/10 text-[#118AB2] px-4 py-2 rounded-full">
                    <Package className="w-4 h-4" />
                    <span className="font-medium">Référence: {product.reference}</span>
                  </div>
                )}
              </div>

              {/* Description courte */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.short_description}
              </p>

              {/* CTA Principal */}
              <div className="space-y-6">
                <Link
                  to="/contact"
                  className="block w-full bg-[#118AB2] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 text-center shadow-lg hover:shadow-xl"
                >
                  Demander une démo
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/contact"
                    className="flex items-center justify-center space-x-2 border-2 border-[#118AB2] text-[#118AB2] px-6 py-3 rounded-xl font-medium hover:bg-[#118AB2] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span>Contact</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  
                  <button className="flex items-center justify-center space-x-2 border-2 border-[#118AB2] text-[#118AB2] px-6 py-3 rounded-xl font-medium hover:bg-[#118AB2] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Description détaillée</h2>
              <div className="w-24 h-1 bg-[#118AB2] mx-auto rounded-full"></div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.long_description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Sticky Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
        <Link
          to="/contact"
          className="block w-full bg-[#118AB2] text-white px-6 py-3 rounded-xl text-center font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Demander une démo
        </Link>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          />
          
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Navigation arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            
            {/* Main image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {currentImage && (
                <img
                  src={getImageUrl(currentImage.url)}
                  alt={product.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </div>
            
            {/* Image counter in modal */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;