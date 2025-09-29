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
  Home,
  Shield
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
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/dashboard/products', icon: Package, label: 'Produits' },
    { path: '/admin/dashboard/slides', icon: Image, label: 'Slides' },
    { path: '/admin/dashboard/blog', icon: FileText, label: 'Blog' },
    { path: '/admin/dashboard/features', icon: Settings, label: 'Fonctionnalités' },
  ];

  const getCurrentUser = () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  };

  const user = getCurrentUser();

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-[#0B0C10] text-white' 
        : 'bg-white text-[#0B0C10]'
    }`}>
      
      {/* Mobile Header */}
      <header className={`lg:hidden sticky top-0 z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-[#1C1C1C] border-b border-[#2A2A2A]' 
          : 'bg-white border-b border-[#E0E0E0]'
      }`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDark 
                ? 'text-[#B0B0B0] hover:text-white hover:bg-[#2A2A2A]' 
                : 'text-[#555555] hover:text-[#0B0C10] hover:bg-[#F0F0F0]'
            }`}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-2">
            <Shield className={`h-6 w-6 ${isDark ? 'text-[#118AB2]' : 'text-[#118AB2]'}`} />
            <h1 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-[#0B0C10]'
            }`}>
              SpiderHome Admin
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link 
              to="/" 
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-[#B0B0B0] hover:text-white hover:bg-[#2A2A2A]' 
                  : 'text-[#555555] hover:text-[#0B0C10] hover:bg-[#F0F0F0]'
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
        <aside className={`hidden lg:block fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${
          isDark 
            ? 'bg-[#1C1C1C] border-r border-[#2A2A2A]' 
            : 'bg-[#F7F7F7] border-r border-[#E0E0E0]'
        }`}>
          
          {/* Sidebar Header */}
          <div className={`p-4 border-b ${
            isDark ? 'border-[#2A2A2A]' : 'border-[#E0E0E0]'
          }`}>
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#118AB2] rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-[#0B0C10]'
                    }`}>
                      SpiderHome
                    </h2>
                    <p className={`text-xs ${
                      isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                    }`}>
                      Administration
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'text-[#B0B0B0] hover:text-white hover:bg-[#2A2A2A]' 
                    : 'text-[#555555] hover:text-[#0B0C10] hover:bg-[#F0F0F0]'
                }`}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? isDark
                            ? 'bg-[#118AB2] text-white'
                            : 'bg-[#118AB2] text-white'
                          : isDark
                            ? 'text-[#B0B0B0] hover:text-white hover:bg-[#2A2A2A]'
                            : 'text-[#555555] hover:text-[#0B0C10] hover:bg-[#F0F0F0]'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
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
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
            isDark ? 'border-[#2A2A2A]' : 'border-[#E0E0E0]'
          }`}>
            {!sidebarCollapsed && user && (
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-[#EF476F] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-[#0B0C10]'
                  }`}>
                    {user.username}
                  </p>
                  <p className={`text-xs capitalize ${
                    isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                  }`}>
                    {user.role}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                sidebarCollapsed ? 'justify-center' : ''
              } ${
                isDark
                  ? 'text-[#EF476F] hover:text-white hover:bg-[#EF476F]/10'
                  : 'text-[#EF476F] hover:text-white hover:bg-[#EF476F]/10'
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
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#1C1C1C] border-r border-[#2A2A2A]">
              <div className="p-4 border-b border-[#2A2A2A]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#118AB2] rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">SpiderHome</h2>
                    <p className="text-[#B0B0B0] text-xs">Administration</p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-[#118AB2] text-white'
                              : 'text-[#B0B0B0] hover:text-white hover:bg-[#2A2A2A]'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              {user && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2A2A]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-[#EF476F] rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.username}</p>
                      <p className="text-[#B0B0B0] text-xs capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-[#EF476F] hover:text-white hover:bg-[#EF476F]/10 transition-all duration-200"
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
        <main className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* Desktop Header */}
          <header className={`hidden lg:block sticky top-0 z-30 transition-all duration-300 ${
            isDark 
              ? 'bg-[#1C1C1C]/95 border-b border-[#2A2A2A]' 
              : 'bg-white/95 border-b border-[#E0E0E0]'
          }`}>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                    }`} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#118AB2]/20 focus:border-[#118AB2] transition-all duration-200 ${
                        isDark
                          ? 'bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder-[#B0B0B0]'
                          : 'bg-[#F7F7F7] border-[#E0E0E0] text-[#0B0C10] placeholder-[#555555]'
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isDark
                        ? 'text-[#B0B0B0] hover:text-white hover:bg-[#2A2A2A]'
                        : 'text-[#555555] hover:text-[#0B0C10] hover:bg-[#F0F0F0]'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span className="text-sm">Voir le site</span>
                  </Link>
                  <button className={`relative p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? 'text-[#B0B0B0] hover:text-white hover:bg-[#2A2A2A]'
                      : 'text-[#555555] hover:text-[#0B0C10] hover:bg-[#F0F0F0]'
                  }`}>
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#EF476F] rounded-full"></span>
                  </button>
                  <ThemeToggle />
                  {user && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#EF476F] rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-[#0B0C10]'
                        }`}>
                          {user.username}
                        </p>
                        <p className={`text-xs capitalize ${
                          isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                        }`}>
                          {user.role}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className={`p-6 transition-all duration-300 ${
            isDark ? 'bg-transparent' : 'bg-[#F7F7F7]/50'
          }`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;