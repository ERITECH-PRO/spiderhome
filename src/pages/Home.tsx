import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Thermometer, Shield, Smartphone, Zap, Home } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Lightbulb,
      title: 'Éclairage intelligent',
      description: 'Contrôlez l\'intensité et la couleur de vos lumières',
    },
    {
      icon: Thermometer,
      title: 'Thermostat connecté',
      description: 'Gérez la température pour un confort optimal',
    },
    {
      icon: Shield,
      title: 'Sécurité avancée',
      description: 'Surveillance et alertes en temps réel',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Maisons connectées' },
    { number: '99.9%', label: 'Temps de fonctionnement' },
    { number: '30%', label: 'Économies d\'énergie' },
    { number: '24/7', label: 'Support technique' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B0C10] via-gray-900 to-[#118AB2] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Votre maison,{' '}
                <span className="text-[#EF476F]">connectée intelligemment</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                Découvrez SpiderHome, la solution domotique qui transforme votre habitat 
                en maison intelligente. Contrôlez tout depuis votre smartphone.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/contact"
                  className="bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  Demander une démo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/fonctionnalites"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#0B0C10] transition-all duration-200 text-center"
                >
                  Découvrir
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="relative">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-[#118AB2] to-[#EF476F] rounded-full flex items-center justify-center shadow-2xl">
                  <Home className="w-32 h-32 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#EF476F] rounded-full flex items-center justify-center animate-pulse">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#118AB2] rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0B0C10] mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
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