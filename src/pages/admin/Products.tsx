import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Eye, Search, Filter, MoreVertical, Package, Tag, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  reference: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const navigate = useNavigate();

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.reference.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Gestion des Produits</h1>
                <p className="text-gray-400 mt-1">Catalogue et modules SpiderHome</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard/products/new')}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Nouveau Produit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>
          </div>
          <div className="lg:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-gray-800">
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
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Produits</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Package className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Résultats</p>
              <p className="text-2xl font-bold text-white">{filteredProducts.length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Search className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Catégories</p>
              <p className="text-2xl font-bold text-white">{categories.length - 1}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Tag className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-700">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-6 hover:bg-gray-700/30 transition-all duration-200 group">
              <div className="flex items-center space-x-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="h-20 w-20 object-cover rounded-xl border border-gray-600 group-hover:border-gray-500 transition-colors"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                </div>
                
                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                      {product.title}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    Référence: <span className="text-gray-300 font-medium">{product.reference}</span>
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Créé le {new Date(product.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/produits/${product.reference.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200"
                    title="Voir sur le site"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/dashboard/products/${product.id}/edit`)}
                    className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-200"
                    title="Modifier"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(product.id)}
                    className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par ajouter votre premier produit.'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={() => navigate('/admin/dashboard/products/new')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
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
            
            <div className="inline-block align-bottom bg-gray-800 border border-gray-700 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-semibold text-white">
                      Supprimer le produit
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-700/50 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;