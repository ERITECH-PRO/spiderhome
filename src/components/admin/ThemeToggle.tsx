import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gray-700/50 border border-gray-600 hover:bg-gray-700 transition-all duration-200 group"
      title={`Basculer vers le mode ${isDark ? 'clair' : 'sombre'}`}
    >
      <div className="relative w-6 h-6">
        {/* Icône du soleil (mode clair) */}
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-yellow-400 transition-all duration-300 ${
            isDark 
              ? 'opacity-0 rotate-90 scale-75' 
              : 'opacity-100 rotate-0 scale-100'
          }`} 
        />
        
        {/* Icône de la lune (mode sombre) */}
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
          }`} 
        />
      </div>
      
      {/* Effet de halo au survol */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </button>
  );
};

export default ThemeToggle;