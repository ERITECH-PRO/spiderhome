import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  User,
  Building
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    requestType: 'demo',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi de formulaire
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        requestType: 'demo',
        consent: false
      });
    }, 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@spiderhome.fr',
      description: 'Réponse sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      description: 'Lun-Ven 9h-18h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: '123 Avenue des Champs-Élysées\n75008 Paris, France',
      description: 'Sur rendez-vous'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lun-Ven: 9h-18h\nSam: 10h-16h',
      description: 'Support 24/7'
    }
  ];

  const faqItems = [
    {
      question: 'Combien coûte une installation SpiderHome ?',
      answer: 'Le prix varie selon la taille de votre logement et vos besoins. Comptez à partir de 1,500€ pour un appartement de base.'
    },
    {
      question: 'Combien de temps dure l\'installation ?',
      answer: 'Une installation standard prend entre 3 et 6 heures selon la complexité de votre projet.'
    },
    {
      question: 'SpiderHome fonctionne-t-il avec mes appareils existants ?',
      answer: 'Oui, SpiderHome est compatible avec plus de 1,000 marques et protocoles (Philips Hue, Nest, Alexa, etc.).'
    },
    {
      question: 'Y a-t-il des frais d\'abonnement ?',
      answer: 'Non, SpiderHome fonctionne sans abonnement mensuel. Seuls les services cloud optionnels sont payants.'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0B0C10] to-[#118AB2] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Prêt à transformer votre maison ? Nos experts SpiderHome vous accompagnent 
              dans votre projet de domotique intelligente.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-[#0B0C10] mb-8">
                  Demandez votre devis gratuit
                </h2>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-[#118AB2] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-[#0B0C10] mb-4">
                      Message envoyé avec succès !
                    </h3>
                    <p className="text-gray-600">
                      Merci pour votre demande. Un de nos experts vous contactera 
                      dans les 24h pour discuter de votre projet.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Request Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type de demande
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: 'demo', label: 'Demander une démo', icon: MessageSquare },
                          { value: 'quote', label: 'Obtenir un devis', icon: Building },
                          { value: 'support', label: 'Support technique', icon: User }
                        ].map((option) => (
                          <label key={option.value} className="relative cursor-pointer">
                            <input
                              type="radio"
                              name="requestType"
                              value={option.value}
                              checked={formData.requestType === option.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                              formData.requestType === option.value
                                ? 'border-[#118AB2] bg-blue-50'
                                : 'border-gray-200 hover:border-[#118AB2]'
                            }`}>
                              <option.icon className="w-6 h-6 mx-auto mb-2 text-[#118AB2]" />
                              <span className="text-sm font-medium">{option.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2] transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2] transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2] transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2] transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Entreprise (optionnel)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2] transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Ex: Installation domotique pour maison 120m²"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2] transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Décrivez votre projet, vos besoins, la taille de votre logement..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#118AB2] transition-colors duration-200 resize-vertical"
                      />
                    </div>

                    {/* Consent */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        required
                        checked={formData.consent}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-[#118AB2] border-gray-300 rounded focus:ring-[#118AB2]"
                      />
                      <label htmlFor="consent" className="text-sm text-gray-600">
                        J'accepte que mes données soient utilisées pour me recontacter concernant ma demande. 
                        Vous pouvez consulter notre <a href="/confidentialite" className="text-[#118AB2] underline">politique de confidentialité</a>.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#EF476F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer ma demande
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#0B0C10] mb-6">
                  Nos coordonnées
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#EF476F] to-[#118AB2] rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0B0C10] mb-1">{info.title}</h4>
                        <p className="text-gray-700 whitespace-pre-line">{info.content}</p>
                        <p className="text-gray-500 text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-[#0B0C10] mb-3">Support instantané</h4>
                <p className="text-gray-600 mb-4 text-sm">
                  Besoin d'une réponse rapide ? Contactez-nous sur WhatsApp !
                </p>
                <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 w-full">
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Écrire sur WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B0C10] mb-4">
              Notre showroom parisien
            </h2>
            <p className="text-xl text-gray-600">
              Venez découvrir nos solutions en action dans notre espace de démonstration
            </p>
          </div>
          <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-[#118AB2] mx-auto mb-4" />
              <p className="text-gray-600">
                Carte Google Maps intégrée<br />
                123 Avenue des Champs-Élysées, 75008 Paris
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0B0C10] mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#0B0C10] mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;