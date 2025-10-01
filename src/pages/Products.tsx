import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, SortAsc, Grid, X, Search, Sparkles, Package, Tag } from 'lucide-react';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';
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
  image_url?: string;
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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'reference' | 'new'>('name');
  const [viewMode] = useState<'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Récupérer les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des produits');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Obtenir les catégories uniques depuis les produits
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'reference':
          return a.reference.localeCompare(b.reference);
        case 'new':
          return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Grouper les produits par catégorie
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};
    
    filteredProducts.forEach(product => {
      const category = product.category || 'Autres';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    
    return grouped;
  }, [filteredProducts]);

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find(img => img.isMain) || product.images[0];
      return getImageUrl(mainImage.url);
    }
    if (product.image_url) {
      return getImageUrl(product.image_url);
    }
    return '/placeholder-product.jpg';
  };

  const ProductCard = ({ product }: { product: Product }) => {
    return (
      <div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col">
        <Link to={`/produits/${product.slug}`} className="block flex flex-col h-full">
          {/* Image Container */}
          <div className="relative h-80 bg-white flex items-center justify-center p-6">
            <div className="relative flex items-center justify-center">
              <LazyImage
                src={getProductImage(product)}
                alt={product.title}
                className="object-contain"
                style={{ 
                  maxWidth: '240px',
                  maxHeight: '240px',
                  width: 'auto',
                  height: 'auto'
                }}
              />
              
              {/* Badge NOUVEAU */}
              {Boolean(product.is_new) && (
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-500 text-white shadow-md">
                    NOWOŚĆ
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-2 text-gray-900 text-center uppercase tracking-wide">
                {product.title}
              </h3>
              
              <p className="text-sm mb-4 text-gray-700 text-center leading-relaxed">
                {product.short_description}
              </p>
            </div>
            
            {/* Bottom Section */}
            <div className="text-center">
              {/* Model */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {product.reference}
                </span>
              </div>
              
              {/* Action Button */}
              <div className="inline-flex items-center text-sm font-medium transition-colors" style={{ color: '#118AB2' }}>
                <span className="hover:opacity-80">Pour en savoir plus</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Produits & Modules SpiderHome - Domotique Intelligente"
        description="Découvrez notre gamme complète de dispositifs connectés pour transformer votre maison en habitat intelligent et économe. Interfaces, éclairage, sécurité, climatisation."
        keywords="domotique, maison connectée, SpiderHome, produits, modules, éclairage intelligent, sécurité, thermostat"
        url="/produits"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-blue-600/10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-white mr-2" />
              <span className="text-white/90 text-sm font-medium">Catalogue de produits</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Produits & Modules
              <span className="block bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                SpiderHome
              </span>
            </h1>
            <p className="text-xl mb-8 text-white/80 max-w-3xl mx-auto leading-relaxed">
              Découvrez notre gamme complète de dispositifs connectés pour transformer 
              votre maison en habitat intelligent et économe en énergie.
            </p>
            {!loading && !error && products.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  <Package className="w-5 h-5 mr-2" />
                  <span className="font-medium">{products.length} Produits</span>
                </div>
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  <Tag className="w-5 h-5 mr-2" />
                  <span className="font-medium">{categories.length} Catégories</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="hidden lg:flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 bg-gray-50 text-gray-900 focus:border-blue-500"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'reference' | 'new')}
                  className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 bg-gray-50 text-gray-900 focus:border-blue-500"
                >
                  <option value="name">Nom</option>
                  <option value="reference">Référence</option>
                  <option value="new">Nouveautés</option>
                </select>
              </div>


              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#118AB2' }}
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 rounded-xl border bg-gray-50 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-900">Filtres</span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-lg transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 bg-white text-gray-900 focus:border-blue-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          {/* Loading and Error States */}
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] py-20">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-600 border-t-blue-500"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-2 border-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s', borderRightColor: '#118AB2' }}></div>
              </div>
              <p className="text-lg text-gray-600">Chargement des produits...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center min-h-[400px] py-20">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border bg-red-100 border-red-200">
                <X className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-lg font-semibold mb-2 text-gray-900">
                Erreur lors du chargement des produits
              </p>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {Object.keys(productsByCategory).length > 0 ? (
                // Affichage par catégories
                Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
                  <div key={categoryName} className="mb-12">
                    {/* Titre de la catégorie */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {categoryName}
                      </h2>
                      <div className="w-24 h-1 mx-auto rounded" style={{ backgroundColor: '#EF476F' }}></div>
                    </div>
                    
                    {/* Grille des produits de cette catégorie */}
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1 max-w-4xl mx-auto'
                    }`}>
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Message quand aucun produit trouvé
                <div className="text-center py-20">
                  <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 border bg-gray-100 border-gray-200">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Aucun produit trouvé
                  </h3>
                  <p className="mb-6 text-gray-600">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Essayez de modifier vos critères de recherche.'
                      : 'Aucun produit disponible pour le moment.'
                    }
                  </p>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                      style={{ backgroundColor: '#118AB2' }}
                    >
                      <X className="h-4 w-4" />
                      <span>Effacer les filtres</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-blue-600/10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-white mr-2" />
              <span className="text-white/90 text-sm font-medium">Solution personnalisée</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Configurez votre solution
              <span className="block bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                sur mesure
              </span>
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto text-white/80 leading-relaxed">
              Chaque maison est unique. Nos experts vous accompagnent pour créer la solution 
              domotique parfaitement adaptée à vos besoins et votre budget.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/contact"
                className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Demander un devis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/fonctionnalites"
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm"
              >
                Voir les fonctionnalités
                <ArrowRight className="ml-2 w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;