import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Eye, Search, ArrowUp, ArrowDown, Image, Monitor, Sparkles, Filter } from 'lucide-react';
import SlideForm from './SlideForm';
import { getImageUrl } from '../../config/config';
import { useTheme } from '../../contexts/ThemeContext';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  alt_text: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const Slides = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/slides', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/slides/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSlides(slides.filter(slide => slide.id !== id));
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const slide = slides.find(s => s.id === id);
      if (!slide) return;

      const response = await fetch(`/api/admin/slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...slide, is_active: !isActive })
      });

      if (response.ok) {
        setSlides(slides.map(s => s.id === id ? { ...s, is_active: !isActive } : s));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleOpenSlideForm = (slideId?: string) => {
    setEditingSlideId(slideId);
    setShowSlideForm(true);
  };

  const handleCloseSlideForm = () => {
    setShowSlideForm(false);
    setEditingSlideId(undefined);
    // Refresh slides list when form is closed
    fetchSlides();
  };

  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Monitor className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Gestion des Slides</h1>
                <p className={`mt-1 ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Bannières du slider principal</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenSlideForm()}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Nouveau Slide</span>
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
                placeholder="Rechercher un slide..."
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
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Total Slides</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{slides.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Monitor className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Résultats</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{filteredSlides.length}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Search className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className={`backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>Slides Actifs</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{slides.filter(s => s.is_active).length}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Eye className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des slides */}
      <div className={`backdrop-blur-sm border rounded-2xl overflow-hidden shadow-xl ${isDark ? 'bg-theme-secondary/90 border-theme-primary/50' : 'bg-white/90 border-gray-200/50'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-theme-primary bg-gradient-to-r from-theme-tertiary/50 to-theme-tertiary' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
          <h2 className={`text-lg font-semibold flex items-center ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            {filteredSlides.length} slide{filteredSlides.length > 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {filteredSlides.map((slide) => (
            <div key={slide.id} className={`rounded-2xl border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 ${isDark ? 'bg-theme-secondary border-theme-primary' : 'bg-white border-gray-200'}`}>
              {/* Image Header */}
              <div className={`relative h-48 ${isDark ? 'bg-gradient-to-br from-theme-tertiary to-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                <img
                  src={getImageUrl(slide.image_url)}
                  alt={slide.alt_text}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                    slide.is_active 
                      ? isDark 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-green-100 text-green-800 border-green-200'
                      : isDark 
                        ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {slide.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                
                {/* Order Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${isDark ? 'bg-theme-secondary/90 text-theme-primary border-theme-primary/20' : 'bg-white/90 text-gray-700 border-white/20'}`}>
                    #{slide.order_index}
                  </span>
                </div>
                
                {/* Action Buttons Overlay */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleActive(slide.id, slide.is_active)}
                      className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${
                        slide.is_active 
                          ? isDark 
                            ? 'bg-theme-secondary/90 text-green-400 hover:text-green-300' 
                            : 'bg-white/90 text-green-600 hover:text-green-700'
                          : isDark 
                            ? 'bg-theme-secondary/90 text-gray-400 hover:text-green-400' 
                            : 'bg-white/90 text-gray-600 hover:text-green-600'
                      }`}
                      title={slide.is_active ? 'Désactiver' : 'Activer'}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenSlideForm(slide.id.toString())}
                      className={`p-2 backdrop-blur-sm text-gray-600 hover:text-blue-600 rounded-lg transition-colors ${isDark ? 'bg-theme-secondary/90 text-gray-400 hover:text-blue-400' : 'bg-white/90 text-gray-600 hover:text-blue-600'}`}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(slide.id)}
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
                  {slide.title}
                </h3>
                
                <p className={`text-sm mb-3 line-clamp-3 ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
                  {slide.subtitle}
                </p>
                
                <div className={`text-xs mb-4 p-2 rounded-lg ${isDark ? 'bg-theme-tertiary/50 text-theme-secondary' : 'bg-gray-100 text-gray-600'}`}>
                  <p className="font-medium">CTA: {slide.cta_text}</p>
                  <p className="text-xs opacity-75">→ {slide.cta_link}</p>
                </div>
                
                <div className={`flex items-center justify-between text-xs mb-4 ${isDark ? 'text-theme-tertiary' : 'text-gray-500'}`}>
                  <div className="flex items-center space-x-1">
                    <Monitor className="h-3 w-3" />
                    <span>Slide #{slide.order_index}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{new Date(slide.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                
                {/* Bottom Actions */}
                <div className={`flex space-x-2 pt-4 border-t ${isDark ? 'border-theme-primary' : 'border-gray-100'}`}>
                  <button
                    onClick={() => toggleActive(slide.id, slide.is_active)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                      slide.is_active 
                        ? isDark 
                          ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        : isDark 
                          ? 'text-theme-secondary hover:text-green-400 hover:bg-green-500/10' 
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {slide.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => handleOpenSlideForm(slide.id.toString())}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${isDark ? 'text-theme-secondary hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(slide.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${isDark ? 'text-theme-secondary hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSlides.length === 0 && (
          <div className="p-12 text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 border ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-gray-100 border-gray-200'}`}>
              <Monitor className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Aucun slide trouvé</h3>
            <p className={`mb-6 ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
              {searchTerm 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par ajouter votre premier slide.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenSlideForm()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter un slide</span>
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
                      Supprimer le slide
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
                        Êtes-vous sûr de vouloir supprimer ce slide ? Cette action est irréversible.
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

      {/* SlideForm Modal */}
      <SlideForm
        isOpen={showSlideForm}
        onClose={handleCloseSlideForm}
        slideId={editingSlideId}
      />
    </div>
  );
};

export default Slides;