import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Search,
  Home
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-400' },
    { path: '/admin/dashboard/products', icon: Package, label: 'Produits', color: 'text-green-400' },
    { path: '/admin/dashboard/slides', icon: Image, label: 'Slides', color: 'text-purple-400' },
    { path: '/admin/dashboard/blog', icon: FileText, label: 'Blog', color: 'text-orange-400' },
    { path: '/admin/dashboard/features', icon: Settings, label: 'Fonctionnalités', color: 'text-cyan-400' },
  ];

  const getCurrentUser = () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  };

  const user = getCurrentUser();

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Mobile Header */}
      <header className={`lg:hidden backdrop-blur-sm border-b sticky top-0 z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`transition-colors ${
              isDark 
                ? 'text-white hover:text-blue-400' 
                : 'text-gray-800 hover:text-blue-600'
            }`}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className={`text-lg font-bold transition-colors ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>SpiderHome Admin</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link 
              to="/" 
              className={`transition-colors ${
                isDark 
                  ? 'text-white hover:text-blue-400' 
                  : 'text-gray-800 hover:text-blue-600'
              }`}
              title="Voir le site"
            >
              <Home className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block backdrop-blur-sm border-r transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${
          isDark 
            ? 'bg-gray-900/95 border-gray-700' 
            : 'bg-white/95 border-gray-200'
        }`}>
          {/* Sidebar Header */}
          <div className={`p-4 border-b transition-colors ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SH</span>
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg transition-colors ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>SpiderHome</h2>
                    <p className={`text-xs transition-colors ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>Administration</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`transition-colors p-1 rounded-lg hover:bg-opacity-20 ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? isDark
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                            : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-300'
                          : isDark
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? isDark
                            ? 'bg-blue-500/20'
                            : 'bg-blue-500/10'
                          : isDark
                            ? 'group-hover:bg-gray-700/50'
                            : 'group-hover:bg-gray-200/50'
                      }`}>
                        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : item.color}`} />
                      </div>
                      {!sidebarCollapsed && (
                        <span className="font-medium text-sm">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t transition-colors ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {!sidebarCollapsed && user && (
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{user.username}</p>
                  <p className={`text-xs capitalize transition-colors ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{user.role}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                sidebarCollapsed ? 'justify-center' : ''
              } ${
                isDark
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <LogOut className="h-5 w-5" />
              {!sidebarCollapsed && <span className="font-medium text-sm">Déconnexion</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SH</span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">SpiderHome</h2>
                    <p className="text-gray-400 text-xs">Administration</p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-blue-500/20' 
                              : 'hover:bg-gray-700/50'
                          }`}>
                            <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : item.color}`} />
                          </div>
                          <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              {user && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.username}</p>
                      <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Déconnexion</span>
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Desktop Header */}
          <header className={`hidden lg:block backdrop-blur-sm border-b sticky top-0 z-30 transition-all duration-300 ${
            isDark 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 ${
                        isDark
                          ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-gray-100/50 border-gray-300 text-gray-800 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-3 py-2 transition-colors rounded-lg ${
                      isDark
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span className="text-sm">Voir le site</span>
                  </Link>
                  <button className={`relative p-2 transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}>
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </button>
                  <ThemeToggle />
                  {user && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium transition-colors ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}>{user.username}</p>
                        <p className={`text-xs capitalize transition-colors ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>{user.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className={`p-6 transition-colors ${
            isDark ? 'bg-transparent' : 'bg-gray-50/50'
          }`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;