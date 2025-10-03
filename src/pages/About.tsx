import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Award, 
  Globe,
  ArrowRight,
  CheckCircle,
  Heart,
  Lightbulb,
  Shield,
  Leaf
} from 'lucide-react';

const About = () => {
  const stats = [
    { number: '2018', label: 'Année de création' },
    { number: '10,000+', label: 'Clients satisfaits' },
    { number: '50+', label: 'Experts techniques' },
    { number: '24/7', label: 'Support disponible' },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Nous développons constamment de nouvelles solutions pour améliorer votre quotidien.'
    },
    {
      icon: Heart,
      title: 'Simplicité',
      description: 'La technologie doit être accessible à tous, sans complexité inutile.'
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Vos données et votre vie privée sont notre priorité absolue.'
    },
    {
      icon: Leaf,
      title: 'Durabilité',
      description: 'Nous contribuons à un avenir plus vert grâce à nos solutions économes en énergie.'
    }
  ];

  const team = [
    {
      name: 'Marc Dupont',
      role: 'Directeur Général',
      description: 'Expert en domotique avec 15 ans d\'expérience dans l\'IoT',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Sarah Martin',
      role: 'Directrice Technique',
      description: 'Spécialiste en intelligence artificielle et systèmes connectés',
      image: 'https://images.pexels.com/photos/3727511/pexels-photo-3727511.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Thomas Bernard',
      role: 'Responsable R&D',
      description: 'Ingénieur électronique passionné par les nouvelles technologies',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Julie Moreau',
      role: 'Directrice Marketing',
      description: 'Experte en expérience utilisateur et stratégie digitale',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const milestones = [
    { year: '2018', title: 'Création de SpiderHome', description: 'Lancement de la startup avec une vision claire : démocratiser la domotique.' },
    { year: '2019', title: 'Première levée de fonds', description: '2M€ levés pour développer nos premiers produits.' },
    { year: '2020', title: 'Lancement commercial', description: 'Mise sur le marché de notre première gamme de produits.' },
    { year: '2021', title: 'Expansion européenne', description: 'Ouverture vers l\'Allemagne, l\'Espagne et l\'Italie.' },
    { year: '2022', title: '10,000 clients', description: 'Franchissement du cap des 10,000 installations.' },
    { year: '2023', title: 'Innovation AI', description: 'Intégration de l\'intelligence artificielle dans nos solutions.' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B0C10] to-[#118AB2] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl mb-8 text-gray-200">
              Nous sommes une équipe passionnée qui croit que la technologie peut simplifier 
              la vie de chacun tout en respectant l'environnement.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
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

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 mb-6 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
                Notre mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Chez SpiderHome, nous croyons que chaque maison devrait être intelligente, 
                confortable et respectueuse de l'environnement. Notre mission est de démocratiser 
                la domotique en rendant la technologie accessible, intuitive et abordable pour tous.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nous développons des solutions innovantes qui apprennent de vos habitudes, 
                s'adaptent à votre mode de vie et vous aident à économiser de l'énergie 
                tout en améliorant votre confort quotidien.
              </p>
              <ul className="space-y-3">
                {[
                  'Rendre la domotique accessible à tous',
                  'Réduire l\'empreinte énergétique des foyers',
                  'Simplifier l\'interaction avec la technologie',
                  'Garantir la sécurité et la confidentialité'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#118AB2]" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="w-96 h-96 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-32 h-32 text-[#118AB2]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Nos valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ces principes guident chacune de nos décisions et innovations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-full flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0B0C10] mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Notre histoire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De startup ambitieuse à leader de la domotique intelligente
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#118AB2] transform md:-translate-x-1/2"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-md ml-12 md:ml-0">
                      <div className="text-2xl font-bold text-[#EF476F] mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-[#0B0C10] mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-[#EF476F] rounded-full border-4 border-white transform md:-translate-x-1/2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Notre équipe dirigeante
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des experts passionnés qui façonnent l'avenir de la domotique
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
                />
                <h3 className="text-xl font-semibold text-[#0B0C10] mb-2">
                  {member.name}
                </h3>
                <div className="text-[#EF476F] font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0C10] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Rejoignez l'aventure SpiderHome
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Découvrez comment notre équipe peut vous aider à créer la maison 
            intelligente de vos rêves.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/contact"
              className="bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Nous contacter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/fonctionnalites"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#0B0C10] transition-all duration-200"
            >
              Découvrir nos solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;