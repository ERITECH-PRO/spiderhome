import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, SortAsc, Grid, List, X } from 'lucide-react';
import { categories, getProductsByCategory } from '../data/products';
import type { Product } from '../data/products';
import SEO from '../components/SEO';
import LazyImage from '../components/LazyImage';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'reference' | 'new'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = getProductsByCategory(selectedCategory);
    
    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reference':
          return a.reference.localeCompare(b.reference);
        case 'new':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });
    
    console.log('Produits filtrés:', filtered);
    return filtered;
  }, [selectedCategory, sortBy]);

  const ProductCard = ({ product }: { product: Product }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      console.log('Navigation vers:', `/produits/${product.slug}`);
      console.log('Produit:', product);
      window.location.href = `/produits/${product.slug}`;
    };

    return (
      <div
        onClick={handleClick}
        className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      >
        <div className="relative">
          {/* Image du produit */}
          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
            <img
              src={product.images[0]?.url || '/placeholder-product.jpg'}
              alt={product.images[0]?.alt || product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          
          {/* Badge Nouveau */}
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-[#EF476F] text-white text-xs px-2 py-1 rounded-full font-medium">
              NOUVEAU
            </div>
          )}
        </div>
        
        {/* Contenu de la carte */}
        <div className="p-4">
          {/* Nom du produit */}
          <h3 className="text-sm font-bold text-[#0B0C10] mb-2 uppercase leading-tight line-clamp-2">
            {product.name}
          </h3>
          
          {/* Référence */}
          <p className="text-xs text-[#0B0C10] mb-3 opacity-75">
            {product.reference}
          </p>
          
          {/* Lien "Pour en savoir plus" */}
          <span className="inline-block text-[#118AB2] hover:text-[#EF476F] text-sm font-medium transition-colors duration-200">
            Pour en savoir plus
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-20">
      <SEO
        title="Produits & Modules SpiderHome - Domotique Intelligente"
        description="Découvrez notre gamme complète de dispositifs connectés pour transformer votre maison en habitat intelligent et économe. Interfaces, éclairage, sécurité, climatisation."
        keywords="domotique, maison connectée, SpiderHome, produits, modules, éclairage intelligent, sécurité, thermostat"
        url="/produits"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B0C10] to-[#118AB2] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Produits & Modules SpiderHome
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Découvrez notre gamme complète de dispositifs connectés pour transformer 
              votre maison en habitat intelligent et économe.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres et contrôles */}
      <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Filtres mobiles */}
            <div className="lg:hidden w-full">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-[#118AB2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>
              </div>

            {/* Filtres desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm font-medium text-[#0B0C10]">Catégorie:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Contrôles de tri et vue */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-[#0B0C10]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'reference' | 'new')}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                >
                  <option value="name">Nom</option>
                  <option value="reference">Référence</option>
                  <option value="new">Nouveautés</option>
                </select>
              </div>

              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#118AB2] text-white' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#118AB2] text-white' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                    </button>
                  </div>
            </div>
          </div>

          {/* Filtres mobiles (collapsible) */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-[#0B0C10]">Filtres</span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
          </div>
          )}
        </div>
      </section>

      {/* Grille des produits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Résultats */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              {selectedCategory !== 'all' && (
                <span> dans la catégorie "{categories.find(c => c.id === selectedCategory)?.name}"</span>
              )}
            </p>
          </div>
          
          {/* Grille responsive */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Message si aucun produit */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun produit trouvé pour cette catégorie.</p>
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0C10] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Configurez votre solution sur mesure
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Chaque maison est unique. Nos experts vous accompagnent pour créer la solution 
            domotique parfaitement adaptée à vos besoins et votre budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/contact"
              className="bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Demander un devis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/fonctionnalites"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#0B0C10] transition-all duration-200"
            >
              Voir les fonctionnalités
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;