import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Eye, Search, Filter, Package, Tag, Calendar, Sparkles } from 'lucide-react';
import ProductForm from './ProductForm';
import { getImageUrl } from '../../config/config';
import { useTheme } from '../../contexts/ThemeContext';

interface Product {
  id: number;
  title: string;
  reference: string;
  description: string;
  image_url?: string;
  images?: ProductImage[];
  category: string;
  created_at: string;
  updated_at: string;
}

interface ProductImage {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  isMain?: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Interfaces', label: 'Interfaces' },
    { value: 'Capteurs', label: 'Capteurs' },
    { value: 'Contrôleurs', label: 'Contrôleurs' },
    { value: 'Éclairage', label: 'Éclairage' },
    { value: 'Sécurité', label: 'Sécurité' },
    { value: 'Automatisation', label: 'Automatisation' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleOpenProductForm = (productId?: string) => {
    setEditingProductId(productId);
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProductId(undefined);
    // Refresh products list when form is closed
    fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-blue-500"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-2 border-transparent border-r-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
        <div className={`relative backdrop-blur-sm border rounded-2xl p-8 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Gestion des Produits</h1>
                <p className={`mt-1 ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Catalogue et modules SpiderHome</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenProductForm()}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Nouveau Produit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary text-theme-primary placeholder-gray-400 focus:border-blue-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'}`}
                style={{
                  backgroundColor: isDark ? 'var(--bg-tertiary)' : '#f9fafb',
                  borderColor: isDark ? 'var(--border-primary)' : '#e5e7eb',
                  color: isDark ? 'var(--text-primary)' : '#111827'
                }}
              />
            </div>
          </div>
          <div className="lg:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none ${isDark ? 'bg-theme-tertiary/50 border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'}`}
                style={{
                  backgroundColor: isDark ? 'var(--bg-tertiary)' : '#f9fafb',
                  borderColor: isDark ? 'var(--border-primary)' : '#e5e7eb',
                  color: isDark ? 'var(--text-primary)' : '#111827'
                }}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Total Produits</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{products.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Résultats</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{filteredProducts.length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Search className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Catégories</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{categories.length - 1}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Tag className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className={`backdrop-blur-sm border rounded-2xl overflow-hidden shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-theme-primary bg-gradient-to-r from-theme-tertiary/50 to-theme-tertiary' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
          <h2 className={`text-lg font-semibold flex items-center ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className={`rounded-2xl border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 ${isDark ? 'bg-theme-secondary border-theme-primary' : 'bg-white border-gray-200'}`}>
              {/* Image Header */}
              <div className={`relative h-48 ${isDark ? 'bg-gradient-to-br from-theme-tertiary to-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                <img
                  src={
                    product.images && product.images.length > 0 
                      ? getImageUrl(product.images[0].url)
                      : product.image_url 
                        ? getImageUrl(product.image_url)
                        : '/placeholder-product.jpg'
                  }
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${isDark ? 'bg-theme-secondary/90 text-theme-primary border-theme-primary/20' : 'bg-white/90 text-gray-700 border-white/20'}`}>
                    {product.category}
                  </span>
                </div>
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/produits/${product.reference.toLowerCase().replace(/\s+/g, '-')}`)}
                      className={`p-2 backdrop-blur-sm text-gray-600 hover:text-blue-600 rounded-lg transition-colors ${isDark ? 'bg-theme-secondary/90 text-gray-400 hover:text-blue-400' : 'bg-white/90 text-gray-600 hover:text-blue-600'}`}
                      title="Voir sur le site"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenProductForm(product.id.toString())}
                      className={`p-2 backdrop-blur-sm text-gray-600 hover:text-blue-600 rounded-lg transition-colors ${isDark ? 'bg-theme-secondary/90 text-gray-400 hover:text-blue-400' : 'bg-white/90 text-gray-600 hover:text-blue-600'}`}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(product.id)}
                      className={`p-2 backdrop-blur-sm text-gray-600 hover:text-red-600 rounded-lg transition-colors ${isDark ? 'bg-theme-secondary/90 text-gray-400 hover:text-red-400' : 'bg-white/90 text-gray-600 hover:text-red-600'}`}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-2 line-clamp-2 transition-colors group-hover:text-blue-600 ${isDark ? 'text-theme-primary group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'}`}>
                  {product.title}
                </h3>
                
                <p className={`text-sm mb-3 line-clamp-3 ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
                  {product.description}
                </p>
                
                <div className={`flex items-center justify-between text-xs mb-4 ${isDark ? 'text-theme-tertiary' : 'text-gray-500'}`}>
                  <div className="flex items-center space-x-1">
                    <Package className="h-3 w-3" />
                    <span>{product.reference}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(product.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                
                {/* Bottom Actions */}
                <div className={`flex space-x-2 pt-4 border-t ${isDark ? 'border-theme-primary' : 'border-gray-100'}`}>
                  <button
                    onClick={() => navigate(`/produits/${product.reference.toLowerCase().replace(/\s+/g, '-')}`)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${isDark ? 'text-theme-secondary hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => handleOpenProductForm(product.id.toString())}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${isDark ? 'text-theme-secondary hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(product.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${isDark ? 'text-theme-secondary hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 border ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-gray-100 border-gray-200'}`}>
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Aucun produit trouvé</h3>
            <p className={`mb-6 ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
              {searchTerm || selectedCategory !== 'all' 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par ajouter votre premier produit.'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={() => handleOpenProductForm()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter un produit</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
            
            <div className={`inline-block align-bottom border rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDark ? 'bg-theme-secondary border-theme-primary' : 'bg-white border-gray-200'}`}>
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full border sm:mx-0 sm:h-10 sm:w-10 ${isDark ? 'bg-red-500/20 border-red-500/30' : 'bg-red-100 border-red-200'}`}>
                    <Trash2 className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-semibold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>
                      Supprimer le produit
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
                        Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-6 py-4 sm:flex sm:flex-row-reverse border-t ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 transform hover:scale-105"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className={`mt-3 w-full inline-flex justify-center rounded-xl border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary hover:bg-theme-tertiary' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ProductForm Modal */}
      <ProductForm
        isOpen={showProductForm}
        onClose={handleCloseProductForm}
        productId={editingProductId}
      />
    </div>
  );
};

export default Products;