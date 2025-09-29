import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const [language, setLanguage] = useState('fr');

  const footerLinks = {
    company: [
      { name: 'À propos', path: '/a-propos' },
      { name: 'Fonctionnalités', path: '/fonctionnalites' },
      { name: 'Produits', path: '/produits' },
      { name: 'Blog', path: '/blog' },
    ],
    legal: [
      { name: 'Conditions d\'utilisation', path: '/conditions' },
      { name: 'Politique de confidentialité', path: '/confidentialite' },
      { name: 'Mentions légales', path: '/mentions-legales' },
      { name: 'Cookies', path: '/cookies' },
    ],
    contact: [
      { icon: Mail, text: 'contact@spiderhome.org' },
      { icon: Phone, text: '+216 29 427 196' },
      { icon: MapPin, text: 'Sfax, Tunisie' },
    ],
  };

  return (
    <footer className="bg-[#0B0C10] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/LOGO SPIDERHOME SANS FONT@1080x.png" 
                alt="SpiderHome Logo" 
                className="h-20 w-auto filter invert"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Votre solution domotique intelligente pour une maison connectée, 
              moderne et économe en énergie. Contrôlez tout depuis votre smartphone.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-[#EF476F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
            >
              Demander une démo
            </Link>
          </div>

          {/* Liens entreprise */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#118AB2]">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-[#EF476F] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#118AB2]">Contact</h3>
            <ul className="space-y-3">
              {footerLinks.contact.map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4 text-[#EF476F]" />
                  <span className="text-gray-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Liens légaux */}
            <div className="flex flex-wrap justify-center md:justify-start space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-400 text-sm hover:text-[#EF476F] transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Sélecteur de langue */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-gray-400 text-sm border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-[#118AB2]"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SpiderHome. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;