import { useState, useEffect, useRef } from 'react';
import { X, Save, Image as ImageIcon, Move, Upload, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getImageUrl } from '../../config/config';

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

interface SlideImage {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

interface SlideFormProps {
  isOpen: boolean;
  onClose: () => void;
  slideId?: string;
}

const SlideForm = ({ isOpen, onClose, slideId }: SlideFormProps) => {
  const { isDark } = useTheme();
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

  // Modal drag functionality
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Image upload functionality
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<SlideImage | null>(null);
  const [fetchingSlide, setFetchingSlide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form when modal opens/closes or slideId changes
    if (isOpen) {
      if (slideId && slideId !== 'new') {
        console.log('Opening slide form for editing slide:', slideId);
        fetchSlide();
      } else {
        console.log('Opening slide form for new slide');
        // Reset form data for new slide
        setFormData({
          title: '',
          subtitle: '',
          cta_text: '',
          cta_link: '',
          image_url: '',
          alt_text: '',
          order_index: 0,
          is_active: true
        });
        setUploadedImage(null);
        // Pour un nouveau slide, définir l'ordre suivant
        fetchNextOrder();
      }
    } else {
      // Reset form when modal is closed
      setFormData({
        title: '',
        subtitle: '',
        cta_text: '',
        cta_link: '',
        image_url: '',
        alt_text: '',
        order_index: 0,
        is_active: true
      });
      setUploadedImage(null);
    }
  }, [slideId, isOpen]);

  const fetchSlide = async () => {
    setFetchingSlide(true);
    try {
      const token = localStorage.getItem('admin_token');
      console.log('Fetching slide with ID:', slideId); // Debug log
      
      const response = await fetch(`/api/admin/slides/${slideId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Slide fetch response status:', response.status); // Debug log

      if (response.ok) {
        const slide = await response.json();
        console.log('Slide data received:', slide); // Debug log
        
        setFormData({
          title: slide.title || '',
          subtitle: slide.subtitle || '',
          cta_text: slide.cta_text || '',
          cta_link: slide.cta_link || '',
          image_url: slide.image_url || '',
          alt_text: slide.alt_text || '',
          order_index: slide.order_index || 0,
          is_active: slide.is_active !== undefined ? slide.is_active : true
        });
        
        // If slide has an image, create uploaded image state
        if (slide.image_url) {
          setUploadedImage({
            id: slideId || 'existing',
            url: slide.image_url,
            filename: slide.image_url.split('/').pop() || 'image.jpg',
            originalName: slide.alt_text || 'Slide image',
            size: 0
          });
        }
      } else {
        console.error('Failed to fetch slide:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du slide:', error);
    } finally {
      setFetchingSlide(false);
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
      const url = slideId && slideId !== 'new' ? `/api/admin/slides/${slideId}` : '/api/admin/slides';
      const method = slideId && slideId !== 'new' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      
      // Keep modal within viewport bounds
      const maxX = window.innerWidth - modalRef.current.offsetWidth;
      const maxY = window.innerHeight - modalRef.current.offsetHeight;
      
      modalRef.current.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      modalRef.current.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Image upload functions
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const imageData: SlideImage = {
          id: result.id || Date.now().toString(),
          url: result.url,
          filename: result.filename,
          originalName: file.name,
          size: file.size
        };
        setUploadedImage(imageData);
        setFormData(prev => ({ ...prev, image_url: result.url }));
      } else {
        console.error('Erreur lors de l\'upload de l\'image');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }

      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all ${
            isDark ? 'bg-theme-secondary border-theme-primary' : 'bg-white border-gray-200'
          } border`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* Modal Header */}
          <div 
            className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-theme-primary bg-gradient-to-r from-theme-tertiary/50 to-theme-tertiary' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'
            }`}
            onMouseDown={handleMouseDown}
            style={{ cursor: 'grab' }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>
                  {slideId && slideId !== 'new' ? 'Modifier le slide' : 'Nouveau slide'}
                </h2>
                <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
                  {slideId && slideId !== 'new' ? 'Modifiez les informations du slide' : 'Créez une nouvelle bannière pour le slider'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-theme-tertiary text-theme-secondary' : 'bg-gray-100 text-gray-500'}`}>
                <Move className="h-4 w-4" />
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-theme-tertiary text-theme-secondary hover:text-theme-primary' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {fetchingSlide ? (
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-blue-500"></div>
                  <div className="absolute inset-0 rounded-full h-12 w-12 border-2 border-transparent border-r-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <span className={`ml-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Chargement du slide...</span>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Informations de base */}
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Informations de base</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                      Titre principal *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                        isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                      placeholder="Votre maison, connectée intelligemment"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                        isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                      placeholder="Contrôlez votre maison depuis n'importe où"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                      Texte du bouton CTA *
                    </label>
                    <input
                      type="text"
                      name="cta_text"
                      value={formData.cta_text}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                        isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                      placeholder="Demander une démo"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                      Lien du bouton CTA *
                    </label>
                    <input
                      type="text"
                      name="cta_link"
                      value={formData.cta_link}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                        isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                      placeholder="/contact"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      name="order_index"
                      value={formData.order_index}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                        isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className={`h-4 w-4 text-blue-500 focus:ring-blue-500 rounded transition-colors ${
                          isDark ? 'border-theme-primary bg-theme-secondary' : 'border-gray-300 bg-white'
                        }`}
                      />
                      <span className={`ml-2 text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>Slide actif</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Image</h2>
                
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                      Image du slide (1920x1080 recommandé) *
                    </label>
                    
                    {/* Upload Button */}
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-200 ${
                          uploading
                            ? 'opacity-50 cursor-not-allowed'
                            : isDark
                              ? 'border-theme-primary bg-theme-secondary text-theme-primary hover:bg-theme-tertiary'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            <span>Upload...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Choisir une image</span>
                          </>
                        )}
                      </button>
                      
                      {uploadedImage && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className={`flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 transition-colors ${
                            isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                          } rounded-lg`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <p className={`mt-2 text-xs ${isDark ? 'text-theme-secondary' : 'text-gray-500'}`}>
                      Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
                    </p>
                  </div>

                  {/* Image Preview */}
                  {uploadedImage && (
                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                        Aperçu
                      </label>
                      <div className={`relative w-full h-48 rounded-lg overflow-hidden border ${
                        isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-gray-100 border-gray-200'
                      }`}>
                        <img
                          src={getImageUrl(uploadedImage.url)}
                          alt={uploadedImage.originalName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className={`mt-2 text-xs ${isDark ? 'text-theme-secondary' : 'text-gray-500'}`}>
                        <p>Fichier: {uploadedImage.originalName}</p>
                        <p>Taille: {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}

                  {/* Alt Text */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                      Texte alternatif de l'image
                    </label>
                    <input
                      type="text"
                      name="alt_text"
                      value={formData.alt_text}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                        isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                      placeholder="Description de l'image pour l'accessibilité"
                    />
                  </div>
                </div>
              </div>

              {/* Presets CTA */}
              <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Presets CTA rapides</h2>
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
                      className={`p-4 border rounded-lg transition-all duration-200 text-left hover:scale-105 ${
                        isDark 
                          ? 'border-theme-primary bg-theme-secondary hover:bg-theme-tertiary text-theme-primary' 
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <p className={`font-medium ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{preset.text}</p>
                      <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>{preset.link}</p>
                    </button>
                  ))}
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <form onSubmit={handleSubmit}>
            <div className={`px-6 py-4 border-t ${
              isDark ? 'border-theme-primary bg-gradient-to-r from-theme-tertiary/50 to-theme-tertiary' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'
            }`}>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-2 border rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'border-theme-primary bg-theme-secondary text-theme-primary hover:bg-theme-tertiary' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || fetchingSlide}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {slideId && slideId !== 'new' ? 'Mettre à jour' : 'Créer le slide'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SlideForm;