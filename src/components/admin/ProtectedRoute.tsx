import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 ProtectedRoute: Vérification de l\'authentification...');
    
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    console.log('🔑 Token trouvé:', !!token);
    console.log('👤 Utilisateur trouvé:', !!user);
    
    if (!token || !user) {
      console.log('❌ Pas de token ou utilisateur, redirection vers login');
      setIsAuthenticated(false);
      return;
    }


    try {
      // Vérification simple côté client - décoder le token JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT invalide - format incorrect');
      }
      
      // Décoder la partie payload (partie 2)
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        // Token expiré
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      // Token invalide
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF476F] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;