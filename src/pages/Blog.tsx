import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Lightbulb, Shield, Smartphone } from 'lucide-react';

const Blog = () => {
  const featuredArticle = {
    title: 'Guide complet : Comment transformer votre maison en habitat intelligent en 2024',
    excerpt: 'Découvrez étape par étape comment moderniser votre domicile avec les dernières technologies domotiques. De l\'éclairage connecté aux systèmes de sécurité avancés.',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Marc Dupont',
    date: '15 Janvier 2024',
    category: 'Guide',
    readTime: '8 min'
  };

  const articles = [
    {
      title: '5 astuces pour économiser 30% sur vos factures d\'électricité avec la domotique',
      excerpt: 'Optimisez votre consommation énergétique grâce à nos conseils d\'experts en automatisation domestique.',
      image: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Sarah Martin',
      date: '12 Janvier 2024',
      category: 'Économies',
      readTime: '5 min',
      icon: Lightbulb
    },
    {
      title: 'Sécurité connectée : les erreurs à éviter absolument',
      excerpt: 'Protégez efficacement votre domicile en évitant les pièges les plus courants des systèmes de sécurité connectés.',
      image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Thomas Bernard',
      date: '10 Janvier 2024',
      category: 'Sécurité',
      readTime: '6 min',
      icon: Shield
    },
    {
      title: 'Domotique et vie privée : ce que vous devez savoir',
      excerpt: 'Comprendre les enjeux de confidentialité dans l\'IoT domestique et comment protéger vos données personnelles.',
      image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Julie Moreau',
      date: '8 Janvier 2024',
      category: 'Confidentialité',
      readTime: '7 min',
      icon: Smartphone
    },
    {
      title: 'Installation DIY vs Installation professionnelle : que choisir ?',
      excerpt: 'Analysons les avantages et inconvénients de chaque approche pour votre projet domotique.',
      image: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Marc Dupont',
      date: '5 Janvier 2024',
      category: 'Installation',
      readTime: '4 min',
      icon: Lightbulb
    },
    {
      title: 'Les tendances domotiques à suivre en 2024',
      excerpt: 'Intelligence artificielle, commande vocale avancée, interopérabilité : découvrez ce qui va révolutionner nos maisons.',
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Sarah Martin',
      date: '3 Janvier 2024',
      category: 'Tendances',
      readTime: '6 min',
      icon: Smartphone
    },
    {
      title: 'Maintenance préventive : gardez votre système domotique au top',
      excerpt: 'Conseils pratiques pour maintenir l\'efficacité et la durabilité de votre installation SpiderHome.',
      image: 'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Thomas Bernard',
      date: '1 Janvier 2024',
      category: 'Maintenance',
      readTime: '5 min',
      icon: Shield
    }
  ];

  const categories = [
    'Tous les articles',
    'Guide',
    'Économies',
    'Sécurité',
    'Installation',
    'Maintenance',
    'Tendances'
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('Tous les articles');

  const filteredArticles = selectedCategory === 'Tous les articles' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B0C10] to-[#118AB2] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xl mb-8 text-gray-200">
              Guides pratiques, conseils d'experts et actualités pour optimiser 
              votre maison connectée avec SpiderHome.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#EF476F] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Article vedette
              </div>
              <h2 className="text-3xl font-bold text-[#0B0C10] mb-4 leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{featuredArticle.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredArticle.date}</span>
                </div>
                <span>{featuredArticle.readTime}</span>
              </div>
              <button className="bg-[#118AB2] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 inline-flex items-center">
                Lire l'article
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div>
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center space-x-4 space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#EF476F] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#118AB2] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#EF476F] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#0B0C10] mb-3 group-hover:text-[#118AB2] transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-[#118AB2] font-semibold hover:text-[#EF476F] transition-colors duration-200 inline-flex items-center">
                      Lire la suite
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#0B0C10] mb-6">
              Restez informé des dernières actualités
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Recevez nos conseils d'experts et les nouveautés SpiderHome 
              directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2]"
              />
              <button className="bg-[#EF476F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200">
                S'abonner
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Pas de spam, désabonnement en un clic.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0C10] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Besoin d'aide pour votre projet ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nos experts sont là pour répondre à toutes vos questions et vous accompagner 
            dans la réalisation de votre maison intelligente.
          </p>
          <Link
            to="/contact"
            className="bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 inline-flex items-center"
          >
            Contacter un expert
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;