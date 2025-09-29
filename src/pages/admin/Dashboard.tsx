import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
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
  Database,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  products: number;
  slides: number;
  blogs: number;
  features: number;
}

const Dashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    slides: 0,
    blogs: 0,
    features: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Produits',
      value: stats.products,
      icon: Package,
      href: '/admin/dashboard/products',
      change: '+12%',
      changeType: 'positive' as const,
      color: isDark ? 'text-[#118AB2]' : 'text-[#118AB2]',
      bgColor: isDark ? 'bg-[#118AB2]/10' : 'bg-[#118AB2]/5'
    },
    {
      title: 'Slides',
      value: stats.slides,
      icon: Image,
      href: '/admin/dashboard/slides',
      change: '+5%',
      changeType: 'positive' as const,
      color: isDark ? 'text-[#EF476F]' : 'text-[#EF476F]',
      bgColor: isDark ? 'bg-[#EF476F]/10' : 'bg-[#EF476F]/5'
    },
    {
      title: 'Articles',
      value: stats.blogs,
      icon: FileText,
      href: '/admin/dashboard/blog',
      change: '+8%',
      changeType: 'positive' as const,
      color: isDark ? 'text-[#118AB2]' : 'text-[#118AB2]',
      bgColor: isDark ? 'bg-[#118AB2]/10' : 'bg-[#118AB2]/5'
    },
    {
      title: 'Fonctionnalités',
      value: stats.features,
      icon: Settings,
      href: '/admin/dashboard/features',
      change: '+3%',
      changeType: 'positive' as const,
      color: isDark ? 'text-[#EF476F]' : 'text-[#EF476F]',
      bgColor: isDark ? 'bg-[#EF476F]/10' : 'bg-[#EF476F]/5'
    }
  ];

  const quickActions = [
    {
      title: 'Nouveau Produit',
      description: 'Ajouter un produit',
      icon: Package,
      action: () => navigate('/admin/dashboard/products/new'),
      color: isDark ? 'text-[#118AB2]' : 'text-[#118AB2]',
      bgColor: isDark ? 'bg-[#118AB2]/10' : 'bg-[#118AB2]/5'
    },
    {
      title: 'Nouveau Slide',
      description: 'Créer un slide',
      icon: Image,
      action: () => navigate('/admin/dashboard/slides/new'),
      color: isDark ? 'text-[#EF476F]' : 'text-[#EF476F]',
      bgColor: isDark ? 'bg-[#EF476F]/10' : 'bg-[#EF476F]/5'
    },
    {
      title: 'Nouvel Article',
      description: 'Rédiger un article',
      icon: FileText,
      action: () => navigate('/admin/dashboard/blog/new'),
      color: isDark ? 'text-[#118AB2]' : 'text-[#118AB2]',
      bgColor: isDark ? 'bg-[#118AB2]/10' : 'bg-[#118AB2]/5'
    },
    {
      title: 'Nouvelle Fonctionnalité',
      description: 'Ajouter une fonctionnalité',
      icon: Settings,
      action: () => navigate('/admin/dashboard/features/new'),
      color: isDark ? 'text-[#EF476F]' : 'text-[#EF476F]',
      bgColor: isDark ? 'bg-[#EF476F]/10' : 'bg-[#EF476F]/5'
    }
  ];

  const systemStatus = [
    {
      title: 'Statut du système',
      status: 'En ligne',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Base de données',
      status: 'Connectée',
      icon: Database,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Site public',
      status: 'Actif',
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-2 mx-auto mb-4 ${
            isDark 
              ? 'border-[#2A2A2A] border-t-[#118AB2]' 
              : 'border-[#E0E0E0] border-t-[#118AB2]'
          }`}></div>
          <p className={`text-sm ${
            isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
          }`}>
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`rounded-xl p-6 border ${
        isDark 
          ? 'bg-[#1C1C1C] border-[#2A2A2A]' 
          : 'bg-white border-[#E0E0E0]'
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${
            isDark ? 'bg-[#118AB2]/20' : 'bg-[#118AB2]/10'
          }`}>
            <Sparkles className={`h-8 w-8 ${
              isDark ? 'text-[#118AB2]' : 'text-[#118AB2]'
            }`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-[#0B0C10]'
            }`}>
              Dashboard SpiderHome
            </h1>
            <p className={`mt-1 ${
              isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
            }`}>
              Vue d'ensemble de votre administration
            </p>
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
              className={`group cursor-pointer rounded-xl p-6 border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                isDark 
                  ? 'bg-[#1C1C1C] border-[#2A2A2A] hover:border-[#118AB2]/30' 
                  : 'bg-white border-[#E0E0E0] hover:border-[#118AB2]/30'
              }`}
              onClick={() => navigate(stat.href)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              
              <div>
                <p className={`text-3xl font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-[#0B0C10]'
                }`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                }`}>
                  {stat.title}
                </p>
              </div>
              
              <div className={`mt-4 flex items-center text-sm transition-colors ${
                isDark 
                  ? 'text-[#B0B0B0] group-hover:text-white' 
                  : 'text-[#555555] group-hover:text-[#0B0C10]'
              }`}>
                <span>Voir détails</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <div className="lg:col-span-2">
          <h2 className={`text-xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-[#0B0C10]'
          }`}>
            <Zap className={`h-5 w-5 mr-2 ${
              isDark ? 'text-[#EF476F]' : 'text-[#EF476F]'
            }`} />
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`group text-left p-6 rounded-xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                    isDark 
                      ? 'bg-[#1C1C1C] border-[#2A2A2A] hover:border-[#118AB2]/30' 
                      : 'bg-white border-[#E0E0E0] hover:border-[#118AB2]/30'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.bgColor}`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${
                        isDark ? 'text-white' : 'text-[#0B0C10]'
                      }`}>
                        {action.title}
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                      }`}>
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Statut du système */}
        <div>
          <h2 className={`text-xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-[#0B0C10]'
          }`}>
            <BarChart3 className={`h-5 w-5 mr-2 ${
              isDark ? 'text-[#118AB2]' : 'text-[#118AB2]'
            }`} />
            Statut du système
          </h2>
          <div className={`rounded-xl p-6 border ${
            isDark 
              ? 'bg-[#1C1C1C] border-[#2A2A2A]' 
              : 'bg-white border-[#E0E0E0]'
          }`}>
            <div className="space-y-4">
              {systemStatus.map((status, index) => {
                const Icon = status.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${status.bgColor}`}>
                      <Icon className={`h-5 w-5 ${status.color}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-[#0B0C10]'
                      }`}>
                        {status.title}
                      </p>
                      <p className={`text-xs ${
                        isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                      }`}>
                        {status.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;