import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Download, ChevronLeft, ChevronRight, X, Home, Package, ExternalLink } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '../data/products';
import type { Product } from '../data/products';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'compatibility' | 'downloads'>('description');

  useEffect(() => {
    console.log('ProductDetail useEffect - slug:', slug);
    if (slug) {
      console.log('Recherche du produit avec le slug:', slug);
      const foundProduct = getProductBySlug(slug);
      console.log('Produit trouvé:', foundProduct);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        console.log('Aucun produit trouvé pour le slug:', slug);
        setProduct(null);
      }
    }
  }, [slug]);

  if (!product) {
    return <Navigate to="/produits" replace />;
  }

  const relatedProducts = getRelatedProducts(product.id);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const getDownloadIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'manual':
        return '📖';
      case 'schema':
        return '📐';
      case 'certificate':
        return '🏆';
      default:
        return '📎';
    }
  };

  return (
    <div className="pt-20">
      <SEO
        title={product.metaTitle}
        description={product.metaDescription}
        keywords={`${product.name}, ${product.reference}, SpiderHome, domotique, ${product.category}`}
        url={`/produits/${product.slug}`}
        type="product"
        product={{
          name: product.name,
          description: product.shortDescription,
          image: product.images[0]?.url || '',
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
            <span className="text-[#0B0C10]">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galerie d'images */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="relative">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <div onClick={() => openLightbox(selectedImageIndex)}>
                    <LazyImage
                      src={product.images[selectedImageIndex]?.url}
                      alt={product.images[selectedImageIndex]?.alt}
                      className="w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300"
                      onLoad={() => {}}
                    />
                  </div>
                </div>
                
                {/* Navigation des images */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badge Nouveau */}
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-[#EF476F] text-white text-sm px-3 py-1 rounded-full font-medium">
                    NOUVEAU
                  </div>
                )}
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === selectedImageIndex 
                          ? 'border-[#EF476F]' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.alt}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations produit */}
            <div className="space-y-6">
              {/* Titre et référence */}
              <div>
                <h1 className="text-3xl font-bold text-[#0B0C10] mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-[#118AB2] font-medium">
                  Référence: {product.reference}
                </p>
              </div>

              {/* Description courte */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Bénéfices clés */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#0B0C10]">Bénéfices clés</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#118AB2] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0B0C10]">{benefit.title}</h4>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

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
                  
                  {product.downloads.length > 0 && (
                    <button className="flex items-center justify-center space-x-2 border-2 border-[#118AB2] text-[#118AB2] px-4 py-3 rounded-lg font-medium hover:bg-[#118AB2] hover:text-white transition-all duration-200">
                      <Download className="w-4 h-4" />
                      <span>Fiche PDF</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onglets de contenu */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Navigation des onglets */}
          <div className="flex flex-wrap border-b border-gray-300 mb-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Spécifications' },
              { id: 'compatibility', label: 'Compatibilité' },
              { id: 'downloads', label: 'Téléchargements' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-[#EF476F] border-b-2 border-[#EF476F]'
                    : 'text-gray-600 hover:text-[#118AB2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu des onglets */}
          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-[#0B0C10]">Caractéristique</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-[#0B0C10]">Valeur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-[#0B0C10]">
                          {spec.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {spec.value} {spec.unit && <span className="text-gray-500">{spec.unit}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Ce produit est compatible avec les systèmes et appareils suivants :
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.compatibility.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-8 h-8 bg-[#118AB2] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-[#0B0C10] font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Téléchargez les documents techniques et guides d'utilisation :
                </p>
                <div className="grid gap-4">
                  {product.downloads.map((download) => (
                    <div key={download.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{getDownloadIcon(download.type)}</span>
                        <div>
                          <h4 className="font-medium text-[#0B0C10]">{download.name}</h4>
                          <p className="text-sm text-gray-500">
                            {download.size} • {download.language}
                          </p>
                        </div>
                      </div>
                      <a
                        href={download.url}
                        download
                        className="flex items-center space-x-2 bg-[#118AB2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Produits liés */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#0B0C10] mb-8 text-center">
              Produits liés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/produits/${relatedProduct.slug}`}
                  className="group block bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square bg-white flex items-center justify-center p-4">
                    <LazyImage
                      src={relatedProduct.images[0]?.url}
                      alt={relatedProduct.images[0]?.alt}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[#0B0C10] mb-2 uppercase leading-tight">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-xs text-[#0B0C10] mb-3 opacity-75">
                      {relatedProduct.reference}
                    </p>
                    <span className="inline-block text-[#118AB2] hover:text-[#EF476F] text-sm font-medium transition-colors duration-200">
                      Voir le produit
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Sticky Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <Link
          to="/contact"
          className="block w-full bg-[#EF476F] text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-opacity-90 transition-colors"
        >
          Demander une démo
        </Link>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-4xl max-h-full">
            <img
              src={product.images[selectedImageIndex]?.url}
              alt={product.images[selectedImageIndex]?.alt}
              className="max-w-full max-h-full object-contain"
            />
            
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
