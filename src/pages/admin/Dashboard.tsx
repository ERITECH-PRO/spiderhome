import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Image, 
  FileText, 
  Settings, 
  Plus,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';

interface DashboardStats {
  products: number;
  slides: number;
  blogs: number;
  features: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    slides: 0,
    blogs: 0,
    features: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Ajouter un produit',
      description: 'Créer un nouveau produit ou module',
      icon: Package,
      color: 'bg-blue-500',
      action: () => navigate('/admin/products/new')
    },
    {
      title: 'Ajouter un slide',
      description: 'Créer une nouvelle bannière',
      icon: Image,
      color: 'bg-green-500',
      action: () => navigate('/admin/slides/new')
    },
    {
      title: 'Nouvel article',
      description: 'Rédiger un article de blog',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => navigate('/admin/blog/new')
    },
    {
      title: 'Nouvelle fonctionnalité',
      description: 'Ajouter une fonctionnalité',
      icon: Settings,
      color: 'bg-orange-500',
      action: () => navigate('/admin/features/new')
    }
  ];

  const statCards = [
    {
      title: 'Produits',
      value: stats.products,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/products'
    },
    {
      title: 'Slides',
      value: stats.slides,
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/slides'
    },
    {
      title: 'Articles publiés',
      value: stats.blogs,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/blog'
    },
    {
      title: 'Fonctionnalités',
      value: stats.features,
      icon: Settings,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/admin/features'
    }
  ];

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d'ensemble de votre site SpiderHome</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(stat.href)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <Plus className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Informations système */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations système</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Statut</p>
              <p className="text-sm text-green-600">En ligne</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Base de données</p>
              <p className="text-sm text-blue-600">Connectée</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Site public</p>
              <p className="text-sm text-purple-600">Actif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liens utiles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Liens utiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-5 w-5 text-gray-400 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Voir le site public</p>
              <p className="text-sm text-gray-600">Consulter le site vitrine</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="h-5 w-5 text-gray-400 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Gérer les produits</p>
              <p className="text-sm text-gray-600">Catalogue et modules</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;