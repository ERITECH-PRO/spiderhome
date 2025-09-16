import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Smartphone, 
  Wifi, 
  Bluetooth,
  Clock,
  BarChart3,
  Users,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: Lightbulb,
      title: 'Éclairage intelligent',
      description: 'Contrôlez l\'intensité, la couleur et l\'ambiance de toutes vos lumières. Créez des scénarios personnalisés pour chaque moment de la journée.',
      benefits: ['Économies d\'énergie jusqu\'à 60%', 'Contrôle à distance', 'Programmation automatique', 'Ambiances personnalisées']
    },
    {
      icon: Thermometer,
      title: 'Gestion climatique',
      description: 'Maintenez la température idéale dans chaque pièce avec notre thermostat intelligent et nos capteurs de température.',
      benefits: ['Confort optimal', 'Réduction des coûts de chauffage', 'Géolocalisation intelligente', 'Historique de consommation']
    },
    {
      icon: Shield,
      title: 'Sécurité avancée',
      description: 'Protégez votre domicile avec des capteurs de mouvement, caméras et alertes en temps réel sur votre smartphone.',
      benefits: ['Surveillance 24/7', 'Alertes instantanées', 'Historique vidéo', 'Mode absent automatique']
    },
    {
      icon: Clock,
      title: 'Automatisation',
      description: 'Créez des routines intelligentes qui s\'adaptent à votre mode de vie et anticipent vos besoins.',
      benefits: ['Scénarios personnalisés', 'Détection de présence', 'Programmation horaire', 'Adaptation météo']
    }
  ];

  const technologies = [
    { icon: Wifi, name: 'Wi-Fi 6', description: 'Connexion ultra-rapide et stable' },
    { icon: Bluetooth, name: 'Bluetooth 5.0', description: 'Faible consommation énergétique' },
    { icon: Smartphone, name: 'Application mobile', description: 'Interface intuitive iOS/Android' },
    { icon: BarChart3, name: 'Intelligence artificielle', description: 'Apprentissage de vos habitudes' }
  ];

  const advantages = [
    {
      title: 'Installation simple',
      description: 'Nos techniciens certifiés installent votre système en moins de 4 heures'
    },
    {
      title: 'Compatible universellement',
      description: 'Fonctionne avec plus de 1000 marques et appareils existants'
    },
    {
      title: 'Économies garanties',
      description: 'Réduisez vos factures d\'énergie de 30% dès le premier mois'
    },
    {
      title: 'Support expert',
      description: 'Assistance technique 7j/7 par nos spécialistes domotique'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      location: 'Lyon',
      text: 'SpiderHome a transformé notre quotidien ! Nous économisons 200€ par mois sur nos factures.',
      rating: 5
    },
    {
      name: 'Jean Martin',
      location: 'Marseille',
      text: 'Installation parfaite et app très intuitive. Je recommande vivement cette solution.',
      rating: 5
    },
    {
      name: 'Sophie Bernard',
      location: 'Toulouse',
      text: 'La sécurité et le confort apportés sont exceptionnels. Un investissement rentable !',
      rating: 5
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B0C10] to-[#118AB2] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Des fonctionnalités qui changent la vie
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Découvrez comment SpiderHome révolutionne votre habitat avec des technologies 
              de pointe et une interface utilisateur exceptionnelle.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#0B0C10] mb-6">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-[#118AB2]" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`text-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="w-80 h-80 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <feature.icon className="w-32 h-32 text-[#118AB2]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Technologies utilisées
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SpiderHome intègre les dernières innovations technologiques pour vous offrir 
              une expérience domotique inégalée.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#0B0C10] mb-2">
                  {tech.name}
                </h3>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SpiderHome */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Pourquoi choisir SpiderHome ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-[#EF476F] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#0B0C10] mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Ce que disent nos clients
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#EF476F] fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-[#0B0C10]">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0C10] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Découvrez SpiderHome en action
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Réservez votre démonstration gratuite et voyez comment nos fonctionnalités 
            peuvent transformer votre quotidien.
          </p>
          <Link
            to="/contact"
            className="bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 inline-flex items-center"
          >
            Demander une démo gratuite
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Features;