import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Fonctionnalités', path: '/fonctionnalites' },
    { name: 'Produits/Modules', path: '/produits' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Blog/Astuces', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/LOGO SPIDERHOME SANS FONT@1080x.png" 
              alt="SpiderHome Logo" 
              className="h-8 w-auto"
            />
            <span className="text-2xl font-bold text-[#0B0C10]">SpiderHome</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-[#EF476F]'
                    : 'text-[#0B0C10] hover:text-[#118AB2]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="bg-[#EF476F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Demander une démo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#0B0C10]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0B0C10]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-[#EF476F] bg-gray-50'
                    : 'text-[#0B0C10] hover:text-[#118AB2] hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 px-4">
              <Link
                to="/contact"
                className="block w-full text-center bg-[#EF476F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Demander une démo
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;