import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Thermometer, Shield, Smartphone, Zap, Home } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  icon_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const HomePage = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les fonctionnalités depuis l'API
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/api/features');
        if (response.ok) {
          const data = await response.json();
          setFeatures(data.filter((f: Feature) => f.is_active));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des fonctionnalités:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const stats = [
    { number: '10,000+', label: 'Maisons connectées' },
    { number: '99.9%', label: 'Temps de fonctionnement' },
    { number: '30%', label: 'Économies d\'énergie' },
    { number: '24/7', label: 'Support technique' },
  ];

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Features Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Fonctionnalités clés
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SpiderHome vous offre un contrôle total sur votre environnement domestique
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#118AB2] mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des fonctionnalités...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="text-center p-8 rounded-xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon_url ? (
                      <img src={feature.icon_url} alt={feature.title} className="w-8 h-8" />
                    ) : (
                      <Lightbulb className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-[#0B0C10] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/fonctionnalites"
              className="bg-[#118AB2] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 inline-flex items-center"
            >
              Voir toutes les fonctionnalités
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#EF476F] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#118AB2] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à transformer votre maison ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers de familles qui ont déjà adopté SpiderHome 
            pour une maison plus intelligente et plus économe.
          </p>
          <Link
            to="/contact"
            className="bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 inline-flex items-center"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;