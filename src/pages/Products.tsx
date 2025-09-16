import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Thermometer, 
  Camera, 
  Smartphone,
  Wifi,
  Battery,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Products = () => {
  const productCategories = [
    {
      title: 'Éclairage connecté',
      icon: Lightbulb,
      description: 'Transformez l\'éclairage de votre maison avec nos solutions intelligentes',
      products: [
        {
          name: 'Ampoules LED connectées',
          description: 'Contrôle d\'intensité et couleur, 16 millions de teintes',
          features: ['Durée de vie 25 ans', 'Économie 80%', 'Compatible Alexa/Google'],
          price: 'À partir de 24.90€'
        },
        {
          name: 'Interrupteurs intelligents',
          description: 'Remplacent vos interrupteurs traditionnels',
          features: ['Installation sans neutre', 'Programmation horaire', 'Contrôle vocal'],
          price: 'À partir de 49.90€'
        },
        {
          name: 'Variateurs connectés',
          description: 'Contrôle précis de l\'intensité lumineuse',
          features: ['Compatible LED/Halogène', 'Fonction mémoire', 'Design élégant'],
          price: 'À partir de 69.90€'
        }
      ]
    },
    {
      title: 'Gestion climatique',
      icon: Thermometer,
      description: 'Optimisez le confort et les économies d\'énergie',
      products: [
        {
          name: 'Thermostat connecté',
          description: 'Contrôle intelligent du chauffage et climatisation',
          features: ['Apprentissage automatique', 'Géolocalisation', 'Économies 23%'],
          price: 'À partir de 199.90€'
        },
        {
          name: 'Capteurs de température',
          description: 'Surveillance précise de chaque pièce',
          features: ['Sans fil', 'Autonomie 2 ans', 'Alertes personnalisées'],
          price: 'À partir de 39.90€'
        },
        {
          name: 'Vannes thermostatiques',
          description: 'Contrôle individuel par radiateur',
          features: ['Installation simple', 'Programmation pièce par pièce', 'Économies ciblées'],
          price: 'À partir de 79.90€'
        }
      ]
    },
    {
      title: 'Sécurité & Surveillance',
      icon: Camera,
      description: 'Protégez votre foyer avec nos systèmes de sécurité avancés',
      products: [
        {
          name: 'Caméras de surveillance',
          description: 'Surveillance HD avec vision nocturne',
          features: ['4K Ultra HD', 'Détection de mouvement IA', 'Stockage cloud'],
          price: 'À partir de 149.90€'
        },
        {
          name: 'Détecteurs de mouvement',
          description: 'Capteurs intelligents multi-zones',
          features: ['Portée 12m', 'Immunité animaux', 'Alertes instantanées'],
          price: 'À partir de 59.90€'
        },
        {
          name: 'Capteurs d\'ouverture',
          description: 'Surveillance portes et fenêtres',
          features: ['Design discret', 'Batterie longue durée', 'Installation adhésive'],
          price: 'À partir de 29.90€'
        }
      ]
    },
    {
      title: 'Hub & Contrôleurs',
      icon: Smartphone,
      description: 'Le cerveau de votre maison connectée',
      products: [
        {
          name: 'Hub central SpiderHome',
          description: 'Centre de contrôle principal de votre installation',
          features: ['Protocoles multiples', 'Interface tactile', 'Sauvegarde cloud'],
          price: 'À partir de 299.90€'
        },
        {
          name: 'Télécommandes universelles',
          description: 'Contrôlez tous vos appareils depuis une télécommande',
          features: ['Écran OLED', 'Reconnaissance vocale', 'Personnalisable'],
          price: 'À partir de 129.90€'
        }
      ]
    }
  ];

  const compatibleBrands = [
    'Philips Hue', 'Amazon Alexa', 'Google Home', 'Apple HomeKit',
    'Samsung SmartThings', 'Nest', 'Sonos', 'Ring'
  ];

  const installationSteps = [
    {
      step: 1,
      title: 'Consultation gratuite',
      description: 'Évaluation personnalisée de vos besoins et de votre habitation'
    },
    {
      step: 2,
      title: 'Devis détaillé',
      description: 'Proposition technique et commerciale adaptée à votre budget'
    },
    {
      step: 3,
      title: 'Installation professionnelle',
      description: 'Pose par nos techniciens certifiés en moins de 4 heures'
    },
    {
      step: 4,
      title: 'Configuration & formation',
      description: 'Paramétrage complet et formation à l\'utilisation'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B0C10] to-[#118AB2] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Produits & Modules SpiderHome
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Découvrez notre gamme complète de dispositifs connectés pour transformer 
              votre maison en habitat intelligent et économe.
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      {productCategories.map((category, categoryIndex) => (
        <section key={categoryIndex} className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center">
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-[#0B0C10] mb-4">
                {category.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {category.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.products.map((product, productIndex) => (
                <div
                  key={productIndex}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  <h3 className="text-xl font-semibold text-[#0B0C10] mb-3">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-[#118AB2]" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#EF476F]">
                      {product.price}
                    </span>
                    <button className="bg-[#118AB2] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 group-hover:scale-105">
                      En savoir plus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Compatible Brands */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Compatibilité universelle
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SpiderHome s'intègre parfaitement avec plus de 1000 marques et appareils 
              connectés déjà présents sur le marché.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {compatibleBrands.map((brand, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Wifi className="w-8 h-8 text-[#118AB2]" />
                </div>
                <span className="font-medium text-[#0B0C10]">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Processus d'installation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De la première consultation à la mise en service, nous vous accompagnons 
              à chaque étape pour une installation parfaite.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {installationSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#EF476F] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-[#0B0C10] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Avantages techniques
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wifi, title: 'Connectivité', desc: 'Wi-Fi 6, Bluetooth 5.0, Zigbee' },
              { icon: Battery, title: 'Autonomie', desc: 'Jusqu\'à 5 ans sur batterie' },
              { icon: Shield, title: 'Sécurité', desc: 'Chiffrement AES 256-bit' },
              { icon: Zap, title: 'Performance', desc: 'Temps de réponse < 100ms' }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl text-center shadow-md">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#0B0C10] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0C10] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Configurez votre solution sur mesure
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Chaque maison est unique. Nos experts vous accompagnent pour créer la solution 
            domotique parfaitement adaptée à vos besoins et votre budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/contact"
              className="bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Demander un devis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/fonctionnalites"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#0B0C10] transition-all duration-200"
            >
              Voir les fonctionnalités
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;