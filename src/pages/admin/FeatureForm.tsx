import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Settings, Image as ImageIcon } from 'lucide-react';

interface FeatureFormData {
  title: string;
  description: string;
  icon: string;
  icon_url: string;
  order_index: number;
  is_active: boolean;
}

const FeatureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FeatureFormData>({
    title: '',
    description: '',
    icon: '',
    icon_url: '',
    order_index: 0,
    is_active: true
  });

  const iconPresets = [
    { name: 'home', label: 'Maison' },
    { name: 'shield', label: 'Sécurité' },
    { name: 'zap', label: 'Énergie' },
    { name: 'settings', label: 'Automatisation' },
    { name: 'smartphone', label: 'Mobile' },
    { name: 'wifi', label: 'Connectivité' },
    { name: 'thermometer', label: 'Climatisation' },
    { name: 'lightbulb', label: 'Éclairage' },
    { name: 'camera', label: 'Surveillance' },
    { name: 'lock', label: 'Sécurité' }
  ];

  useEffect(() => {
    if (id && id !== 'new') {
      fetchFeature();
    } else {
      // Pour une nouvelle fonctionnalité, définir l'ordre suivant
      fetchNextOrder();
    }
  }, [id]);

  const fetchFeature = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/features/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const feature = await response.json();
        setFormData(feature);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la fonctionnalité:', error);
    }
  };

  const fetchNextOrder = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/features', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const features = await response.json();
        const maxOrder = Math.max(...features.map((f: any) => f.order_index), 0);
        setFormData(prev => ({ ...prev, order_index: maxOrder + 1 }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ordre:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = id && id !== 'new' ? `/api/admin/features/${id}` : '/api/admin/features';
      const method = id && id !== 'new' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/admin/features');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/features')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id && id !== 'new' ? 'Modifier la fonctionnalité' : 'Nouvelle fonctionnalité'}
          </h1>
          <p className="text-gray-600">
            {id && id !== 'new' ? 'Modifiez les informations de la fonctionnalité' : 'Ajoutez une nouvelle fonctionnalité au site'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la fonctionnalité *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="Contrôle intelligent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="Décrivez cette fonctionnalité en quelques phrases..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  name="order_index"
                  value={formData.order_index}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#EF476F] focus:ring-[#EF476F] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Fonctionnalité active</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Icône */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Icône</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'icône (Lucide React)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="home, shield, zap, settings..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'icône personnalisée
              </label>
              <input
                type="url"
                name="icon_url"
                value={formData.icon_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="https://example.com/icon.svg"
              />
            </div>

            {/* Presets d'icônes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icônes prédéfinies
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {iconPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: preset.name }))}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.icon === preset.name
                        ? 'border-[#EF476F] bg-[#EF476F] text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-medium">{preset.label}</div>
                    <div className="text-xs text-gray-500">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aperçu de l'icône */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aperçu
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {formData.icon_url ? (
                    <img
                      src={formData.icon_url}
                      alt="Icône personnalisée"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : formData.icon ? (
                    <Settings className="h-8 w-8 text-gray-600" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {formData.icon_url ? 'Icône personnalisée' : 
                     formData.icon ? `Icône: ${formData.icon}` : 
                     'Aucune icône sélectionnée'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu */}
        {formData.title && formData.description && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h2>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#118AB2] rounded-lg flex items-center justify-center">
                    {formData.icon_url ? (
                      <img
                        src={formData.icon_url}
                        alt={formData.title}
                        className="w-6 h-6 object-contain filter brightness-0 invert"
                      />
                    ) : (
                      <Settings className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {formData.title}
                  </h3>
                  <p className="text-gray-600">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/features')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#EF476F] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {id && id !== 'new' ? 'Mettre à jour' : 'Créer la fonctionnalité'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeatureForm;
