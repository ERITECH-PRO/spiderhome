import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, FileText, Move, Upload, Trash2, Eye, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getImageUrl } from '../../config/config';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  status: 'draft' | 'published';
  meta_title: string;
  meta_description: string;
}

interface BlogImage {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

interface BlogFormProps {
  isOpen: boolean;
  onClose: () => void;
  blogId?: string;
}

const BlogForm = ({ isOpen, onClose, blogId }: BlogFormProps) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    author: 'SpiderHome',
    status: 'draft',
    meta_title: '',
    meta_description: ''
  });

  // Modal drag functionality
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Image upload functionality
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<BlogImage | null>(null);
  const [fetchingBlog, setFetchingBlog] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPost = useCallback(async () => {
    setFetchingBlog(true);
    try {
      const token = localStorage.getItem('admin_token');
      console.log('Fetching blog with ID:', blogId); // Debug log
      
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Blog fetch response status:', response.status); // Debug log

      if (response.ok) {
        const post = await response.json();
        console.log('Blog data received:', post); // Debug log
        
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          image_url: post.image_url || '',
          author: post.author || 'SpiderHome',
          status: post.status || 'draft',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || ''
        });
        
        // If blog has an image, create uploaded image state
        if (post.image_url) {
          setUploadedImage({
            id: blogId || 'existing',
            url: post.image_url,
            filename: post.image_url.split('/').pop() || 'image.jpg',
            originalName: post.title || 'Blog image',
            size: 0
          });
        }
        setIsSlugManuallyEdited(true); // Don't auto-generate slug for existing posts
      } else {
        console.error('Failed to fetch blog:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
    } finally {
      setFetchingBlog(false);
    }
  }, [blogId]);

  useEffect(() => {
    // Reset form when modal opens/closes or blogId changes
    if (isOpen) {
      if (blogId && blogId !== 'new') {
        console.log('Opening blog form for editing blog:', blogId);
        fetchPost();
      } else {
        console.log('Opening blog form for new blog');
        // Reset form data for new blog
        setFormData({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          image_url: '',
          author: 'SpiderHome',
          status: 'draft',
          meta_title: '',
          meta_description: ''
        });
        setUploadedImage(null);
        setIsSlugManuallyEdited(false);
      }
    } else {
      // Reset form when modal is closed
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image_url: '',
        author: 'SpiderHome',
        status: 'draft',
        meta_title: '',
        meta_description: ''
      });
      setUploadedImage(null);
      setIsSlugManuallyEdited(false);
    }
  }, [blogId, isOpen, fetchPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = blogId && blogId !== 'new' ? `/api/admin/blogs/${blogId}` : '/api/admin/blogs';
      const method = blogId && blogId !== 'new' ? 'PUT' : 'POST';

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
        const imageData: BlogImage = {
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-générer le slug à partir du titre (only if not manually edited)
    if (name === 'title' && !isSlugManuallyEdited) {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }

    // Mark slug as manually edited if user changes it
    if (name === 'slug') {
      setIsSlugManuallyEdited(true);
    }
  };

  const generateExcerpt = () => {
    if (formData.content) {
      const excerpt = formData.content
        .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
        .substring(0, 160)
        .trim();
      setFormData(prev => ({ ...prev, excerpt }));
    }
  };

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
          className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all ${
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
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>
                  {blogId && blogId !== 'new' ? 'Modifier l\'article' : 'Nouvel article'}
                </h2>
                <p className={`text-sm ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>
                  {blogId && blogId !== 'new' ? 'Modifiez l\'article de blog' : 'Rédigez un nouvel article de blog'}
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
            {fetchingBlog ? (
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-blue-500"></div>
                  <div className="absolute inset-0 rounded-full h-12 w-12 border-2 border-transparent border-r-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <span className={`ml-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Chargement de l'article...</span>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Informations de base */}
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Informations de base</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                        Titre de l'article *
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
                        placeholder="Titre accrocheur de votre article"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                          Slug (URL) *
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                              isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            }`}
                            placeholder="titre-de-l-article"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSlug = generateSlug(formData.title);
                              setFormData(prev => ({ ...prev, slug: newSlug }));
                              setIsSlugManuallyEdited(true);
                            }}
                            className={`px-3 py-2 border rounded-lg transition-all duration-200 ${
                              isDark ? 'border-theme-primary bg-theme-secondary text-theme-primary hover:bg-theme-tertiary' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                            title="Régénérer le slug"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                          Auteur
                        </label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                            isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                          Statut
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                            isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          }`}
                        >
                          <option value="draft">Brouillon</option>
                          <option value="published">Publié</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Image de l'article</h2>
                  
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                        Image de l'article (1200x630 recommandé)
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
                  </div>
                </div>

                {/* Contenu */}
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Contenu</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                        Extrait (résumé court)
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <button
                          type="button"
                          onClick={generateExcerpt}
                          className={`text-sm transition-colors ${
                            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          Générer automatiquement
                        </button>
                      </div>
                      <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                          isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        placeholder="Résumé court de l'article (généré automatiquement si vide)"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                        Contenu de l'article *
                      </label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={15}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 font-mono text-sm ${
                          isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        placeholder="Rédigez votre article ici. Vous pouvez utiliser du HTML basique pour la mise en forme."
                      />
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                  <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Optimisation SEO</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                        Titre SEO
                      </label>
                      <input
                        type="text"
                        name="meta_title"
                        value={formData.meta_title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                          isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        placeholder="Titre optimisé pour les moteurs de recherche"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-theme-secondary' : 'text-gray-700'}`}>
                        Description SEO
                      </label>
                      <textarea
                        name="meta_description"
                        value={formData.meta_description}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${
                          isDark ? 'bg-theme-secondary border-theme-primary text-theme-primary focus:border-blue-400' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        placeholder="Description optimisée pour les moteurs de recherche (150-160 caractères)"
                      />
                    </div>
                  </div>
                </div>

                {/* Aperçu */}
                {formData.title && formData.content && (
                  <div className={`rounded-xl border p-6 ${isDark ? 'bg-theme-tertiary/50 border-theme-primary' : 'bg-gray-50 border-gray-200'}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>Aperçu</h2>
                    
                    <div className={`border rounded-lg p-4 ${isDark ? 'border-theme-primary bg-theme-secondary' : 'border-gray-200 bg-white'}`}>
                      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-theme-primary' : 'text-gray-900'}`}>{formData.title}</h3>
                      {formData.excerpt && (
                        <p className={`mb-4 ${isDark ? 'text-theme-secondary' : 'text-gray-600'}`}>{formData.excerpt}</p>
                      )}
                      <div 
                        className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}
                        dangerouslySetInnerHTML={{ __html: formData.content.substring(0, 300) + '...' }}
                      />
                    </div>
                  </div>
                )}
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
                  disabled={loading || fetchingBlog}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {blogId && blogId !== 'new' ? 'Mettre à jour' : 'Créer l\'article'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;