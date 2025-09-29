import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/admin/ThemeToggle';

const Login = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
      isDark 
        ? 'bg-[#0B0C10]' 
        : 'bg-white'
    }`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-[#118AB2] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h2 className={`text-3xl font-bold transition-colors ${
            isDark ? 'text-white' : 'text-[#0B0C10]'
          }`}>
            SpiderHome Admin
          </h2>
          <p className={`mt-2 text-sm transition-colors ${
            isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
          }`}>
            Interface d'administration
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className={`border rounded-2xl shadow-lg p-8 transition-all duration-300 ${
            isDark 
              ? 'bg-[#1C1C1C] border-[#2A2A2A]' 
              : 'bg-white border-[#E0E0E0]'
          }`}>
            {error && (
              <div className={`mb-4 px-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-[#EF476F]/10 border-[#EF476F]/20 text-[#EF476F]' 
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Nom d'utilisateur */}
              <div>
                <label htmlFor="username" className={`block text-sm font-medium mb-2 transition-colors ${
                  isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                }`}>
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${
                      isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                    }`} />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2]/20 focus:border-[#118AB2] transition-all duration-300 ${
                      isDark
                        ? 'bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder-[#B0B0B0]'
                        : 'bg-[#F7F7F7] border-[#E0E0E0] text-[#0B0C10] placeholder-[#555555]'
                    }`}
                    placeholder="admin_spiderhome"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-colors ${
                  isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                }`}>
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${
                      isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
                    }`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#118AB2]/20 focus:border-[#118AB2] transition-all duration-300 ${
                      isDark
                        ? 'bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder-[#B0B0B0]'
                        : 'bg-[#F7F7F7] border-[#E0E0E0] text-[#0B0C10] placeholder-[#555555]'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className={`h-5 w-5 transition-colors ${
                        isDark ? 'text-[#B0B0B0] hover:text-white' : 'text-[#555555] hover:text-[#0B0C10]'
                      }`} />
                    ) : (
                      <Eye className={`h-5 w-5 transition-colors ${
                        isDark ? 'text-[#B0B0B0] hover:text-white' : 'text-[#555555] hover:text-[#0B0C10]'
                      }`} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bouton de connexion */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#EF476F] hover:bg-[#d63d5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF476F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
              
            </div>

            {/* Informations de connexion */}
            <div className={`mt-6 p-4 rounded-xl border transition-all duration-300 ${
              isDark 
                ? 'bg-[#2A2A2A] border-[#2A2A2A]' 
                : 'bg-[#F7F7F7] border-[#E0E0E0]'
            }`}>
              <h4 className={`text-sm font-medium mb-2 transition-colors ${
                isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
              }`}>Identifiants de test :</h4>
              <div className={`text-xs space-y-1 transition-colors ${
                isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
              }`}>
                <p><strong>Utilisateur :</strong> admin_spiderhome</p>
                <p><strong>Mot de passe :</strong> Industrial2024</p>
              </div>
            </div>
          </div>
        </form>

        {/* Toggle de thème */}
        <div className="flex justify-center mt-6">
          <ThemeToggle />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-sm transition-colors ${
            isDark ? 'text-[#B0B0B0]' : 'text-[#555555]'
          }`}>
            © 2024 SpiderHome. Interface d'administration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;