import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';

interface SlideFormData {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  alt_text: string;
  order_index: number;
  is_active: boolean;
}

const SlideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SlideFormData>({
    title: '',
    subtitle: '',
    cta_text: '',
    cta_link: '',
    image_url: '',
    alt_text: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchSlide();
    } else {
      // Pour un nouveau slide, définir l'ordre suivant
      fetchNextOrder();
    }
  }, [id]);

  const fetchSlide = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/slides/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const slide = await response.json();
        setFormData(slide);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du slide:', error);
    }
  };

  const fetchNextOrder = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/slides', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const slides = await response.json();
        const maxOrder = Math.max(...slides.map((s: any) => s.order_index), 0);
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
      const url = id && id !== 'new' ? `/api/admin/slides/${id}` : '/api/admin/slides';
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
        navigate('/admin/slides');
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

  const ctaPresets = [
    { text: 'Demander une démo', link: '/contact' },
    { text: 'Découvrir la sécurité intelligente', link: '/fonctionnalites' },
    { text: 'Voir comment ça marche', link: '/produits' },
    { text: 'Créer mes scénarios', link: '/contact' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/slides')}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id && id !== 'new' ? 'Modifier le slide' : 'Nouveau slide'}
          </h1>
          <p className="text-gray-600">
            {id && id !== 'new' ? 'Modifiez les informations du slide' : 'Créez une nouvelle bannière pour le slider'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre principal *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="Votre maison, connectée intelligemment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="Contrôlez votre maison depuis n'importe où"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte du bouton CTA *
              </label>
              <input
                type="text"
                name="cta_text"
                value={formData.cta_text}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="Demander une démo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien du bouton CTA *
              </label>
              <input
                type="text"
                name="cta_link"
                value={formData.cta_link}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="/contact"
              />
            </div>

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
                <span className="ml-2 text-sm text-gray-700">Slide actif</span>
              </label>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image (1920x1080 recommandé) *
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte alternatif de l'image
              </label>
              <input
                type="text"
                name="alt_text"
                value={formData.alt_text}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
                placeholder="Description de l'image pour l'accessibilité"
              />
            </div>

            {/* Aperçu de l'image */}
            {formData.image_url && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aperçu
                </label>
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt={formData.alt_text || 'Aperçu du slide'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {!formData.image_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Aperçu de l'image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Presets CTA */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Presets CTA rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ctaPresets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  cta_text: preset.text,
                  cta_link: preset.link
                }))}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <p className="font-medium text-gray-900">{preset.text}</p>
                <p className="text-sm text-gray-600">{preset.link}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/slides')}
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
            {id && id !== 'new' ? 'Mettre à jour' : 'Créer le slide'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SlideForm;
