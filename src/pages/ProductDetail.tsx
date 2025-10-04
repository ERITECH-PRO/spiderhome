import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Download, ChevronLeft, ChevronRight, X, Home, Package, ZoomIn, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { getImageUrl } from '../config/config';

interface ProductImage {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  isMain?: boolean;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  reference: string;
  category: string;
  short_description: string;
  long_description: string;
  image_url: string;
  images?: ProductImage[];
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
  const [activeTab, setActiveTab] = useState('description');

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
          
          // Vérifier le cache local d'abord
          const cacheKey = `product_${slug}`;
          const cachedData = localStorage.getItem(cacheKey);
          const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
          const now = Date.now();
          const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes pour les détails produit
          
          if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
            setProduct(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
          
          const response = await fetch(`/api/products/${slug}`, {
            headers: {
              'Cache-Control': 'max-age=600' // 10 minutes
            }
          });
          
          if (response.ok) {
            const productData = await response.json();
            setProduct(productData);
            
            // Mettre en cache
            localStorage.setItem(cacheKey, JSON.stringify(productData));
            localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
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

  // Utiliser les vraies données de la base de données
  const specifications = product?.specifications || [];
  const downloads = product?.downloads || [];
  const relatedProducts = product?.related_products || [];

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
            <span className="text-[#0B0C10]">{product.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-[#0B0C10] font-medium">{product.title}</span>
          </nav>
        </div>
      </section>



      {/* Zone principale - 2 colonnes */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Colonne gauche - Images */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="relative group">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
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
                  <div className="absolute top-4 left-4 bg-[#EF476F] text-white text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                    NOUVEAU
                  </div>
                )}
              </div>
              
              {/* Miniatures */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
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
                </div>
              )}
            </div>

            {/* Colonne droite - Informations */}
            <div className="space-y-8">
              {/* Nom du produit */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0B0C10] mb-2">
                  {product.title}
                </h2>
                <div className="text-lg text-[#118AB2] font-semibold mb-4">
                  {product.reference}
                </div>
              </div>

              {/* Description courte */}
              <div className="text-gray-700 text-lg leading-relaxed">
                {product.short_description}
              </div>

            {/* Caractéristiques principales (dynamiques depuis l'admin) */}
            {Array.isArray(product.benefits) && product.benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0B0C10]">Caractéristiques du produit</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit: any, index: number) => {
                    const label = typeof benefit === 'string' 
                      ? benefit 
                      : (benefit?.title || benefit?.description || '');
                    if (!label) return null;
                    return (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-[#118AB2] flex-shrink-0" />
                        <span className="text-gray-700">{label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

              {/* Boutons CTA */}
              <div className="space-y-4">
                <Link
                  to="/contact"
                  className="block w-full bg-[#EF476F] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-red-600 transition-all duration-200 transform hover:scale-105 text-center shadow-lg hover:shadow-xl"
                >
                  Demander une démo
                </Link>
                
                {downloads.length > 0 ? (
                  <a
                    href={downloads[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 border-2 border-[#118AB2] text-[#118AB2] px-6 py-3 rounded-xl font-medium hover:bg-[#118AB2] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    <span>Télécharger la fiche technique</span>
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-400 px-6 py-3 rounded-xl font-medium cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    <span>Fiche technique non disponible</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onglets */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Navigation des onglets */}
            <div className="flex flex-wrap border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-[#118AB2] border-b-2 border-[#118AB2]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'specifications'
                    ? 'text-[#118AB2] border-b-2 border-[#118AB2]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Spécifications techniques
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'downloads'
                    ? 'text-[#118AB2] border-b-2 border-[#118AB2]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Téléchargements
              </button>
            </div>

            {/* Contenu des onglets */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-[#0B0C10] mb-6">Description du produit</h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {product.long_description ? (
                      <div dangerouslySetInnerHTML={{ __html: product.long_description.replace(/\n/g, '<br>') }} />
                    ) : (
                      <p>{product.short_description}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[480px] border border-gray-200 rounded-xl divide-y divide-gray-200">
                      {specifications.map((spec: any, index: number) => {
                        const name = spec?.name ?? spec?.label ?? spec?.parametre ?? spec?.paramètre ?? '';
                        const value = spec?.value ?? spec?.valeur ?? '';
                        const unit = spec?.unit ?? spec?.unite ?? spec?.unité ?? '';
                        if (!name && !value && !unit) return null;
                          return (
                            <div key={index} className="grid grid-cols-12 gap-0 px-4 py-3 bg-white">
                              <div className="col-span-6 text-gray-700 pr-4 border-r border-gray-200">{name}</div>
                              <div className="col-span-4 text-[#118AB2] font-medium pl-4 pr-2">{value} {unit}</div>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'downloads' && (
                <div>
                  <h3 className="text-2xl font-bold text-[#0B0C10] mb-6">Documentation</h3>
                  <div className="space-y-4">
                    {downloads.length > 0 ? (
                      downloads.map((download: any, index: number) => (
                        <a
                          key={index}
                          href={download.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#118AB2] hover:bg-[#118AB2]/5 transition-all duration-200 group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#118AB2]/10 rounded-lg flex items-center justify-center group-hover:bg-[#118AB2]/20 transition-colors">
                              <FileText className="w-6 h-6 text-[#118AB2]" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{download.name}</div>
                              <div className="text-sm text-gray-500">{download.type} • {download.size}</div>
                            </div>
                          </div>
                          <Download className="w-5 h-5 text-gray-400 group-hover:text-[#118AB2] transition-colors" />
                        </a>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Aucun document disponible pour le moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Produits similaires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B0C10] mb-4">Produits similaires</h2>
            <div className="w-24 h-1 bg-[#EF476F] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct: any) => (
                <div key={relatedProduct.id} className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 overflow-hidden">
                    {relatedProduct.image_url ? (
                      <img
                        src={getImageUrl(relatedProduct.image_url)}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{relatedProduct.short_description}</p>
                  <Link
                    to={`/produits/${relatedProduct.slug}`}
                    className="inline-flex items-center text-[#118AB2] hover:text-blue-700 font-medium"
                  >
                    Voir le produit
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Aucun produit similaire disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

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