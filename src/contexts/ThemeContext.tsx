import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Vérifier si nous sommes côté client avant d'accéder à localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('spiderhome-admin-theme') as Theme;
      return savedTheme || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Vérifier si nous sommes côté client
    if (typeof window !== 'undefined') {
      // Sauvegarder le thème dans localStorage
      localStorage.setItem('spiderhome-admin-theme', theme);
      
      // Appliquer le thème au document
      document.documentElement.setAttribute('data-theme', theme);
      
      // Ajouter une classe pour les transitions
      document.documentElement.classList.add('theme-transition');
      
      // Supprimer la classe après la transition
      const timer = setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
