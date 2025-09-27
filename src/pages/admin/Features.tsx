import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Settings,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  icon_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const Features = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/features', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des fonctionnalités:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/features/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFeatures(features.filter(feature => feature.id !== id));
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const feature = features.find(f => f.id === id);
      if (!feature) return;

      const response = await fetch(`/api/admin/features/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...feature, is_active: !isActive })
      });

      if (response.ok) {
        setFeatures(features.map(f => f.id === id ? { ...f, is_active: !isActive } : f));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const moveFeature = async (id: number, direction: 'up' | 'down') => {
    try {
      const feature = features.find(f => f.id === id);
      if (!feature) return;

      const currentIndex = features.findIndex(f => f.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= features.length) return;

      const targetFeature = features[newIndex];
      const newOrder = targetFeature.order_index;
      const oldOrder = feature.order_index;

      const token = localStorage.getItem('admin_token');
      
      // Échanger les ordres
      await Promise.all([
        fetch(`/api/admin/features/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...feature, order_index: newOrder })
        }),
        fetch(`/api/admin/features/${targetFeature.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...targetFeature, order_index: oldOrder })
        })
      ]);

      // Mettre à jour l'état local
      setFeatures(prev => {
        const newFeatures = [...prev];
        newFeatures[currentIndex] = { ...feature, order_index: newOrder };
        newFeatures[newIndex] = { ...targetFeature, order_index: oldOrder };
        return newFeatures.sort((a, b) => a.order_index - b.order_index);
      });
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
    }
  };

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF476F]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fonctionnalités</h1>
          <p className="text-gray-600">Gérez les fonctionnalités affichées sur le site</p>
        </div>
        <button
          onClick={() => navigate('/admin/features/new')}
          className="mt-4 sm:mt-0 bg-[#EF476F] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une fonctionnalité
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une fonctionnalité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
          />
        </div>
      </div>

      {/* Liste des fonctionnalités */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredFeatures.length} fonctionnalité{filteredFeatures.length > 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredFeatures.map((feature, index) => (
            <div key={feature.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                {/* Icône */}
                <div className="flex-shrink-0">
                  {feature.icon_url ? (
                    <img
                      src={feature.icon_url}
                      alt={feature.title}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Ordre: {feature.order_index}
                    </span>
                    {feature.is_active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {feature.description}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Contrôles d'ordre */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveFeature(feature.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Monter"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveFeature(feature.id, 'down')}
                      disabled={index === filteredFeatures.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Descendre"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleActive(feature.id, feature.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      feature.is_active 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={feature.is_active ? 'Désactiver' : 'Activer'}
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate(`/admin/features/${feature.id}/edit`)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteModal(feature.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredFeatures.length === 0 && (
          <div className="p-12 text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune fonctionnalité trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par ajouter votre première fonctionnalité.'
              }
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/admin/features/new')}
                  className="bg-[#EF476F] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Ajouter une fonctionnalité
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Supprimer la fonctionnalité
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer cette fonctionnalité ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default Features;
