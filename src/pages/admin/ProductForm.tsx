import { useState, useEffect, useRef } from 'react';
import { X, Save, Plus, Trash2, Package, Settings, Search, Eye, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { getImageUrl } from '../../config/config';
import { useTheme } from '../../contexts/ThemeContext';

interface ProductImage {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  isMain?: boolean;
}

interface ProductFormData {
  title: string;
  slug: string;
  reference: string;
  category: string;
  short_description: string;
  long_description: string;
  images: ProductImage[];
  specifications: Array<{ name: string; value: string; unit?: string }>;
  benefits: Array<{ icon: string; title: string; description: string }>;
  downloads: Array<{ name: string; type: string; url: string; size: string; language: string }>;
  compatibility: string[];
  related_products: string[];
  is_new: boolean;
  featured: boolean;
  meta_title: string;
  meta_description: string;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
}

const ProductForm = ({ isOpen, onClose, productId }: ProductFormProps) => {
  const { isDark } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    slug: '',
    reference: '',
    category: '',
    short_description: '',
    long_description: '',
    images: [],
    specifications: [],
    benefits: [],
    downloads: [],
    compatibility: [],
    related_products: [],
    is_new: false,
    featured: false,
    meta_title: '',
    meta_description: ''
  });

  const categories = [
    'Interfaces', 'Mesure', 'Éclairage', 'Climatisation', 'Sécurité', 'Contrôleurs'
  ];


  useEffect(() => {
    if (productId && productId !== 'new') {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const product = await response.json();
        setFormData({
          ...product,
          images: product.images || [],
          specifications: product.specifications || [],
          benefits: product.benefits || [],
          downloads: product.downloads || [],
          compatibility: product.compatibility || [],
          related_products: product.related_products || []
        });
        // Mark slug as manually edited when loading existing product
        setIsSlugManuallyEdited(true);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} n'est pas un fichier image valide`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} est trop volumineux (max 5MB)`);
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de l'upload de ${file.name}`);
        }

        const result = await response.json();
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
          isMain: false
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  };

  const removeImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const setMainImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = productId && productId !== 'new' ? `/api/admin/products/${productId}` : '/api/admin/products';
      const method = productId && productId !== 'new' ? 'PUT' : 'POST';

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

  // Function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[àáâäçéèêëïîôöùúûüÿñ]/g, (match) => {
        const map: { [key: string]: string } = {
          'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a',
          'ç': 'c',
          'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
          'ï': 'i', 'î': 'i',
          'ô': 'o', 'ö': 'o',
          'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
          'ÿ': 'y',
          'ñ': 'n'
        };
        return map[match] || match;
      })
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const newData = {
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      
      // Auto-generate slug when title changes (only if slug hasn't been manually edited)
      if (name === 'title' && value && !isSlugManuallyEdited) {
        newData.slug = generateSlug(value);
      }
      
      // Track if slug is manually edited
      if (name === 'slug') {
        setIsSlugManuallyEdited(true);
      }
      
      return newData;
    });
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: '', value: '', unit: '' }]
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, { icon: '', title: '', description: '' }]
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => 
        i === index ? { ...benefit, [field]: value } : benefit
      )
    }));
  };

  // Modal drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-draggable="true"]')) {
      setIsDragging(true);
      const rect = modalRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && modalRef.current) {
      const x = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - modalRef.current.offsetWidth));
      const y = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - modalRef.current.offsetHeight));
      modalRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const tabs = [
    { id: 'basic', label: 'Informations', icon: Package },
    { id: 'specs', label: 'Spécifications', icon: Settings },
    { id: 'benefits', label: 'Bénéfices', icon: Eye },
    { id: 'seo', label: 'SEO', icon: Search }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out ${
          isDark ? 'bg-theme-secondary border border-theme-primary' : 'bg-white border border-gray-200'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Modal Header */}
        <div 
          className="bg-gradient-to-r from-[#118AB2] to-[#073B4C] text-white p-6 cursor-move select-none"
          data-draggable="true"
        >
          <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
        <div>
                <h1 className="text-2xl font-bold">
                  {productId && productId !== 'new' ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
                <p className="text-blue-100">
                  {productId && productId !== 'new' ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
          </p>
        </div>
      </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isCompleted = tabs.findIndex(t => t.id === activeTab) > index;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? `border-[#118AB2] text-[#118AB2] ${isDark ? 'bg-theme-secondary' : 'bg-white'}`
                      : isCompleted
                      ? `border-green-500 text-green-600 ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`
                      : `border-transparent ${isDark ? 'text-theme-secondary hover:text-theme-primary hover:border-theme-primary' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} />
                  <span>{tab.label}</span>
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Content */}
        <div className={`flex-1 overflow-y-auto max-h-[calc(90vh-200px)] ${isDark ? 'bg-theme-secondary' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-white border-gray-200'}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-[#118AB2]" />
                    Informations de base
                  </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
                Titre du produit *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                        placeholder="Nom du produit"
              />
            </div>

            <div>
                       <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
                Slug (URL) *
              </label>
                       <div className="flex space-x-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                           className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                placeholder="nom-du-produit"
              />
                         <button
                           type="button"
                           onClick={() => {
                             if (formData.title) {
                               setFormData(prev => ({
                                 ...prev,
                                 slug: generateSlug(formData.title)
                               }));
                               setIsSlugManuallyEdited(false);
                             }
                           }}
                           className="px-3 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-colors"
                           title="Régénérer le slug à partir du titre"
                           disabled={!formData.title}
                         >
                           <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                           </svg>
                         </button>
                       </div>
                       <p className="text-xs text-gray-500 mt-1">
                         Le slug est généré automatiquement à partir du titre. Vous pouvez le modifier manuellement si nécessaire.
                       </p>
            </div>

            <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
                Référence *
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                        placeholder="REF-001"
              />
            </div>

            <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
                        Images du produit
              </label>
                      
                      {/* Image Upload Area */}
                      <div className="space-y-4">
                        {/* Upload Button */}
                        <div 
                          className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#118AB2] transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
              <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          
                          {uploading ? (
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#118AB2] mb-2"></div>
                              <p className="text-sm text-gray-600">Upload en cours...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="p-3 bg-gray-100 rounded-full mb-3">
                                <Upload className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600 mb-1">Cliquez pour télécharger des images</p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB chacun</p>
                              <p className="text-xs text-gray-400 mt-1">Vous pouvez sélectionner plusieurs fichiers</p>
                            </div>
                          )}
                        </div>

                        {/* Images Grid */}
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {formData.images.map((image) => (
                              <div key={image.id} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#118AB2] transition-colors">
                                  <img
                                    src={getImageUrl(image.url)}
                                    alt={image.originalName}
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {/* Main Image Badge */}
                                  {image.isMain && (
                                    <div className="absolute top-2 left-2 bg-[#118AB2] text-white text-xs px-2 py-1 rounded-full">
                                      Principale
                                    </div>
                                  )}
                                  
                                  {/* Action Buttons */}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setMainImage(image.id)}
                                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                      title="Définir comme image principale"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(image.id)}
                                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Image Info */}
                                <div className="mt-2 text-xs text-gray-500 truncate">
                                  {image.originalName}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={formData.is_new}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#EF476F] focus:ring-[#EF476F] border-gray-300 rounded"
                />
                        <span className="ml-2 text-sm ${isDark ? 'text-theme-primary' : 'text-gray-700'}">Nouveau produit</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#EF476F] focus:ring-[#EF476F] border-gray-300 rounded"
                />
                        <span className="ml-2 text-sm ${isDark ? 'text-theme-primary' : 'text-gray-700'}">Produit vedette</span>
              </label>
            </div>
          </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
              Description courte *
            </label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              required
              rows={3}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                        placeholder="Description courte du produit"
            />
          </div>

                    <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
              Description longue
            </label>
            <textarea
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              rows={5}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                        placeholder="Description détaillée du produit"
            />
          </div>
        </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-[#118AB2]" />
                      Spécifications techniques
                    </h2>
            <button
              type="button"
              onClick={addSpecification}
                      className="bg-gradient-to-r from-[#118AB2] to-[#073B4C] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </button>
          </div>

          <div className="space-y-4">
            {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="text"
                  placeholder="Nom de la spécification"
                  value={spec.name}
                  onChange={(e) => updateSpecification(index, 'name', e.target.value)}
                          className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                />
                <input
                  type="text"
                  placeholder="Valeur"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                          className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                />
                <input
                  type="text"
                          placeholder="Unité"
                  value={spec.unit}
                  onChange={(e) => updateSpecification(index, 'unit', e.target.value)}
                          className="w-24 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                          className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
                    {formData.specifications.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune spécification ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
                      </div>
                    )}
                  </div>
          </div>
        </div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-[#118AB2]" />
                      Bénéfices clés
                    </h2>
            <button
              type="button"
              onClick={addBenefit}
                      className="bg-gradient-to-r from-[#118AB2] to-[#073B4C] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </button>
          </div>

                  <div className="space-y-6">
            {formData.benefits.map((benefit, index) => (
                      <div key={index} className="p-6 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                            placeholder="Icône (ex: 🚀, ⚡, 💡)"
                    value={benefit.icon}
                    onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                  />
                  <input
                    type="text"
                            placeholder="Titre du bénéfice"
                    value={benefit.title}
                    onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                            className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                          placeholder="Description détaillée du bénéfice"
                  value={benefit.description}
                  onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                />
              </div>
            ))}
                    {formData.benefits.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucun bénéfice ajouté</p>
                        <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
                      </div>
                    )}
                  </div>
          </div>
        </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-theme-tertiary border-theme-primary' : 'bg-white border-gray-200'}`}>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Search className="h-5 w-5 mr-2 text-[#118AB2]" />
                    Optimisation SEO
                  </h2>
                  
                  <div className="space-y-6">
            <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
                Titre SEO
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                        placeholder="Titre optimisé pour les moteurs de recherche"
              />
                      <p className="text-xs text-gray-500 mt-1">Recommandé: 50-60 caractères</p>
            </div>

            <div>
                      <label className="block text-sm font-medium ${isDark ? 'text-theme-primary' : 'text-gray-700'} mb-2">
                Description SEO
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2] focus:border-transparent transition-all ${isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary' : 'border-gray-300 bg-white text-gray-900'}"
                        placeholder="Description optimisée pour les moteurs de recherche"
              />
                      <p className="text-xs text-gray-500 mt-1">Recommandé: 150-160 caractères</p>
                    </div>
            </div>
          </div>
        </div>
            )}

            {/* Form Actions */}
            <div className={`flex justify-between items-center pt-6 border-t ${isDark ? 'border-theme-primary' : 'border-gray-200'}`}>
              <div className="flex space-x-2">
                {activeTab !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1].id);
                      }
                    }}
                    className="flex items-center px-4 py-2 ${isDark ? 'text-theme-secondary hover:text-theme-primary' : 'text-gray-600 hover:text-gray-800'} transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </button>
                )}
              </div>

              <div className="flex space-x-4">
          <button
            type="button"
                  onClick={onClose}
                  className={`px-6 py-3 border rounded-xl transition-all ${isDark ? 'border-theme-primary text-theme-primary hover:bg-theme-tertiary' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-[#EF476F] to-[#F77F00] text-white rounded-xl hover:shadow-lg transition-all flex items-center disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
                  {productId && productId !== 'new' ? 'Mettre à jour' : 'Créer le produit'}
          </button>
              </div>

              <div className="flex space-x-2">
                {activeTab !== 'seo' && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1].id);
                      }
                    }}
                    className="flex items-center px-4 py-2 ${isDark ? 'text-theme-secondary hover:text-theme-primary' : 'text-gray-600 hover:text-gray-800'} transition-colors"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;