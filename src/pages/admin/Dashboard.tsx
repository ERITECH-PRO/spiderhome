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
  Eye,
  Activity,
  Zap,
  Globe,
  BarChart3,
  ArrowRight,
  Sparkles,
  Database
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
      title: 'Nouveau Produit',
      description: 'Créer un produit ou module',
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      action: () => navigate('/admin/dashboard/products/new')
    },
    {
      title: 'Nouveau Slide',
      description: 'Ajouter une bannière',
      icon: Image,
      gradient: 'from-purple-500 to-pink-500',
      action: () => navigate('/admin/dashboard/slides/new')
    },
    {
      title: 'Nouvel Article',
      description: 'Rédiger un article',
      icon: FileText,
      gradient: 'from-green-500 to-emerald-500',
      action: () => navigate('/admin/dashboard/blog/new')
    },
    {
      title: 'Nouvelle Fonctionnalité',
      description: 'Ajouter une fonctionnalité',
      icon: Settings,
      gradient: 'from-orange-500 to-red-500',
      action: () => navigate('/admin/dashboard/features/new')
    }
  ];

  const statCards = [
    {
      title: 'Produits',
      value: stats.products,
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      href: '/admin/dashboard/products',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Slides',
      value: stats.slides,
      icon: Image,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      href: '/admin/dashboard/slides',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Articles',
      value: stats.blogs,
      icon: FileText,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
      href: '/admin/dashboard/blog',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Fonctionnalités',
      value: stats.features,
      icon: Settings,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-500/10 to-orange-600/10',
      href: '/admin/dashboard/features',
      change: '+3%',
      changeType: 'positive'
    }
  ];

  const systemStatus = [
    {
      title: 'Statut du système',
      status: 'En ligne',
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Base de données',
      status: 'Connectée',
      icon: Database,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Performance',
      status: 'Optimale',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Site public',
      status: 'Actif',
      icon: Globe,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

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
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard SpiderHome</h1>
              <p className="text-gray-400 mt-1">Vue d'ensemble de votre administration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => navigate(stat.href)}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, ${stat.gradient.split(' ')[3]})` }}></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.bgGradient}`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                </div>
                
                <div className="mt-4 flex items-center text-gray-400 group-hover:text-white transition-colors">
                  <span className="text-sm">Voir détails</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 text-left overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Plus className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2 group-hover:text-white transition-colors">{action.title}</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statut système et liens utiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Statut système */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-400" />
            Statut système
          </h2>
          <div className="space-y-4">
            {systemStatus.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                    </div>
                  </div>
                  <span className="text-green-400 font-medium">{item.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Liens utiles */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            Liens utiles
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Eye className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Site public</p>
                  <p className="text-gray-400 text-sm">Consulter le site vitrine</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
            
            <button
              onClick={() => navigate('/admin/dashboard/products')}
              className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Package className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Gérer les produits</p>
                  <p className="text-gray-400 text-sm">Catalogue et modules</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;