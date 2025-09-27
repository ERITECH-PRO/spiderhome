import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  FileText,
  Calendar
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  status: 'draft' | 'published';
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id));
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const post = posts.find(p => p.id === id);
      if (!post) return;

      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...post, status: newStatus })
      });

      if (response.ok) {
        setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Gérez les articles de votre blog</p>
        </div>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="mt-4 sm:mt-0 bg-[#EF476F] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel article
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={post.image_url || '/placeholder-blog.jpg'}
                    alt={post.title}
                    className="h-20 w-32 object-cover rounded-lg"
                  />
                </div>
                
                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {post.title}
                    </h3>
                    {post.status === 'published' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Publié
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Brouillon
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div>
                      Slug: {post.slug}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStatus(post.id, post.status)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      post.status === 'published'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                    title={post.status === 'published' ? 'Mettre en brouillon' : 'Publier'}
                  >
                    {post.status === 'published' ? 'Dépublier' : 'Publier'}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Voir sur le site"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteModal(post.id)}
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
        
        {filteredPosts.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun article trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par rédiger votre premier article.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/admin/blog/new')}
                  className="bg-[#EF476F] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Nouvel article
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
                      Supprimer l'article
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
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

export default Blog;
