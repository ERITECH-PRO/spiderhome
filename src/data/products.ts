export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  thumbnail?: string;
}

export interface ProductSpec {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductDownload {
  id: string;
  name: string;
  type: 'pdf' | 'manual' | 'schema' | 'certificate';
  url: string;
  size: string;
  language: string;
}

export interface ProductBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  images: ProductImage[];
  benefits: ProductBenefit[];
  specifications: ProductSpec[];
  downloads: ProductDownload[];
  compatibility: string[];
  relatedProducts: string[];
  isNew?: boolean;
  featured?: boolean;
  metaTitle: string;
  metaDescription: string;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'interface-signalisation-wifi',
    name: 'INTERFACE D\'ENTRÉE DE SIGNALISATION WI-FI',
    reference: 'INW-01',
    category: 'Interfaces',
    shortDescription: 'Interface de signalisation Wi-Fi pour intégration domotique',
    longDescription: 'L\'interface d\'entrée de signalisation Wi-Fi INW-01 permet de connecter vos systèmes d\'alarme et de signalisation à votre réseau domotique SpiderHome. Compatible avec tous les protocoles standards, elle offre une intégration transparente et fiable.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Interface d\'entrée de signalisation Wi-Fi INW-01',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Interface INW-01 - Vue de côté',
        thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Interface INW-01 - Connexions',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'wifi',
        title: 'Connectivité Wi-Fi',
        description: 'Intégration directe à votre réseau Wi-Fi domestique'
      },
      {
        icon: 'shield',
        title: 'Sécurité renforcée',
        description: 'Chiffrement AES-256 pour une sécurité maximale'
      },
      {
        icon: 'zap',
        title: 'Installation simple',
        description: 'Configuration automatique en moins de 5 minutes'
      }
    ],
    specifications: [
      { name: 'Tension d\'alimentation', value: '12-24', unit: 'V DC' },
      { name: 'Consommation', value: '0.5', unit: 'W' },
      { name: 'Température de fonctionnement', value: '-10 à +60', unit: '°C' },
      { name: 'Protocole de communication', value: 'Wi-Fi 802.11 b/g/n' },
      { name: 'Ports d\'entrée', value: '4', unit: 'contacts secs' },
      { name: 'Dimensions', value: '85 x 55 x 25', unit: 'mm' },
      { name: 'Certification', value: 'CE, RoHS' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique INW-01',
        type: 'pdf',
        url: '/downloads/INW-01-fiche-technique.pdf',
        size: '2.3 MB',
        language: 'FR'
      },
      {
        id: '2',
        name: 'Manuel d\'installation',
        type: 'manual',
        url: '/downloads/INW-01-manuel-installation.pdf',
        size: '5.1 MB',
        language: 'FR'
      },
      {
        id: '3',
        name: 'Schéma de câblage',
        type: 'schema',
        url: '/downloads/INW-01-schema-cablage.pdf',
        size: '1.8 MB',
        language: 'FR'
      }
    ],
    compatibility: ['SpiderHome Hub', 'Amazon Alexa', 'Google Home', 'Apple HomeKit'],
    relatedProducts: ['2', '3', '8'],
    isNew: true,
    metaTitle: 'Interface signalisation Wi-Fi INW-01 - SpiderHome',
    metaDescription: 'Interface d\'entrée de signalisation Wi-Fi pour intégration domotique. Compatible avec tous les systèmes d\'alarme. Installation simple et sécurisée.'
  },
  {
    id: '2',
    slug: 'transformateur-courant-400a',
    name: 'TRANSFORMATEUR DE COURANT 400 A / 133,3 mA',
    reference: 'SC-36',
    category: 'Mesure',
    shortDescription: 'Transformateur de courant pour mesure de consommation électrique',
    longDescription: 'Le transformateur de courant SC-36 permet de mesurer précisément la consommation électrique de votre installation. Avec une précision de classe 1, il s\'intègre parfaitement dans votre système de monitoring énergétique SpiderHome.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Transformateur de courant SC-36',
        thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Transformateur SC-36 - Installation',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'zap',
        title: 'Précision élevée',
        description: 'Classe de précision 1 pour des mesures fiables'
      },
      {
        icon: 'shield',
        title: 'Installation sécurisée',
        description: 'Montage sans coupure d\'alimentation'
      },
      {
        icon: 'chart',
        title: 'Monitoring continu',
        description: 'Surveillance en temps réel de la consommation'
      }
    ],
    specifications: [
      { name: 'Courant primaire', value: '400', unit: 'A' },
      { name: 'Courant secondaire', value: '133.3', unit: 'mA' },
      { name: 'Classe de précision', value: '1' },
      { name: 'Fréquence', value: '50/60', unit: 'Hz' },
      { name: 'Tension d\'isolement', value: '3', unit: 'kV' },
      { name: 'Dimensions', value: '120 x 80 x 45', unit: 'mm' },
      { name: 'Poids', value: '0.8', unit: 'kg' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique SC-36',
        type: 'pdf',
        url: '/downloads/SC-36-fiche-technique.pdf',
        size: '1.9 MB',
        language: 'FR'
      },
      {
        id: '2',
        name: 'Guide d\'installation',
        type: 'manual',
        url: '/downloads/SC-36-guide-installation.pdf',
        size: '3.2 MB',
        language: 'FR'
      }
    ],
    compatibility: ['SpiderHome Hub', 'Compteurs électriques', 'Systèmes de monitoring'],
    relatedProducts: ['1', '3', '5'],
    metaTitle: 'Transformateur courant 400A SC-36 - SpiderHome',
    metaDescription: 'Transformateur de courant 400A pour mesure précise de consommation électrique. Classe de précision 1, installation sécurisée.'
  },
  {
    id: '3',
    slug: 'transformateur-courant-200a',
    name: 'TRANSFORMATEUR DE COURANT 200 A / 66,6 mA',
    reference: 'SC-24',
    category: 'Mesure',
    shortDescription: 'Transformateur de courant compact pour installations résidentielles',
    longDescription: 'Le transformateur de courant SC-24 est spécialement conçu pour les installations résidentielles. Son format compact et sa précision de classe 1 en font l\'outil idéal pour le monitoring énergétique de votre maison.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Transformateur de courant SC-24',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'home',
        title: 'Format compact',
        description: 'Idéal pour les installations résidentielles'
      },
      {
        icon: 'zap',
        title: 'Précision optimale',
        description: 'Classe de précision 1 pour des mesures fiables'
      },
      {
        icon: 'wrench',
        title: 'Installation facile',
        description: 'Montage rapide et sécurisé'
      }
    ],
    specifications: [
      { name: 'Courant primaire', value: '200', unit: 'A' },
      { name: 'Courant secondaire', value: '66.6', unit: 'mA' },
      { name: 'Classe de précision', value: '1' },
      { name: 'Fréquence', value: '50/60', unit: 'Hz' },
      { name: 'Tension d\'isolement', value: '3', unit: 'kV' },
      { name: 'Dimensions', value: '100 x 70 x 40', unit: 'mm' },
      { name: 'Poids', value: '0.6', unit: 'kg' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique SC-24',
        type: 'pdf',
        url: '/downloads/SC-24-fiche-technique.pdf',
        size: '1.7 MB',
        language: 'FR'
      }
    ],
    compatibility: ['SpiderHome Hub', 'Compteurs électriques', 'Systèmes de monitoring'],
    relatedProducts: ['1', '2', '5'],
    metaTitle: 'Transformateur courant 200A SC-24 - SpiderHome',
    metaDescription: 'Transformateur de courant 200A compact pour installations résidentielles. Précision classe 1, format optimisé.'
  },
  {
    id: '4',
    slug: 'ampoule-led-connectee-rgb',
    name: 'AMPOULE LED CONNECTÉE RGB',
    reference: 'ALC-001',
    category: 'Éclairage',
    shortDescription: 'Ampoule LED connectée avec 16 millions de couleurs',
    longDescription: 'L\'ampoule LED connectée ALC-001 révolutionne l\'éclairage de votre maison. Avec 16 millions de couleurs disponibles et une luminosité ajustable, créez l\'ambiance parfaite pour chaque moment.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Ampoule LED connectée RGB ALC-001',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'palette',
        title: '16M de couleurs',
        description: 'Personnalisez l\'ambiance avec une palette infinie'
      },
      {
        icon: 'smartphone',
        title: 'Contrôle intelligent',
        description: 'Gestion via smartphone et assistants vocaux'
      },
      {
        icon: 'zap',
        title: 'Économie d\'énergie',
        description: 'Jusqu\'à 80% d\'économie par rapport aux ampoules classiques'
      }
    ],
    specifications: [
      { name: 'Puissance', value: '9', unit: 'W' },
      { name: 'Luminosité', value: '800', unit: 'lm' },
      { name: 'Température de couleur', value: '2700-6500', unit: 'K' },
      { name: 'Durée de vie', value: '25000', unit: 'h' },
      { name: 'Connectivité', value: 'Wi-Fi 802.11n' },
      { name: 'Culot', value: 'E27' },
      { name: 'Dimensions', value: '60 x 110', unit: 'mm' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique ALC-001',
        type: 'pdf',
        url: '/downloads/ALC-001-fiche-technique.pdf',
        size: '2.1 MB',
        language: 'FR'
      },
      {
        id: '2',
        name: 'Guide d\'utilisation',
        type: 'manual',
        url: '/downloads/ALC-001-guide-utilisation.pdf',
        size: '4.3 MB',
        language: 'FR'
      }
    ],
    compatibility: ['Amazon Alexa', 'Google Home', 'Apple HomeKit', 'SpiderHome Hub'],
    relatedProducts: ['9', '5'],
    metaTitle: 'Ampoule LED connectée RGB ALC-001 - SpiderHome',
    metaDescription: 'Ampoule LED connectée avec 16 millions de couleurs. Contrôle intelligent, économie d\'énergie, compatible assistants vocaux.'
  },
  {
    id: '5',
    slug: 'thermostat-connecte-intelligent',
    name: 'THERMOSTAT CONNECTÉ INTELLIGENT',
    reference: 'TCI-200',
    category: 'Climatisation',
    shortDescription: 'Thermostat intelligent avec apprentissage automatique',
    longDescription: 'Le thermostat connecté intelligent TCI-200 apprend vos habitudes et optimise automatiquement le confort et les économies d\'énergie. Interface tactile intuitive et contrôle à distance.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Thermostat connecté intelligent TCI-200',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'brain',
        title: 'IA intégrée',
        description: 'Apprentissage automatique de vos habitudes'
      },
      {
        icon: 'trending-down',
        title: 'Économies garanties',
        description: 'Jusqu\'à 30% d\'économie sur votre facture'
      },
      {
        icon: 'smartphone',
        title: 'Contrôle à distance',
        description: 'Gestion complète depuis votre smartphone'
      }
    ],
    specifications: [
      { name: 'Température de consigne', value: '5-35', unit: '°C' },
      { name: 'Précision', value: '±0.5', unit: '°C' },
      { name: 'Écran', value: 'Tactile 3.5"', unit: 'pouces' },
      { name: 'Connectivité', value: 'Wi-Fi, Bluetooth' },
      { name: 'Alimentation', value: '230V ou pile' },
      { name: 'Dimensions', value: '120 x 120 x 25', unit: 'mm' },
      { name: 'Certification', value: 'CE, RoHS' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique TCI-200',
        type: 'pdf',
        url: '/downloads/TCI-200-fiche-technique.pdf',
        size: '2.8 MB',
        language: 'FR'
      },
      {
        id: '2',
        name: 'Manuel d\'installation',
        type: 'manual',
        url: '/downloads/TCI-200-manuel-installation.pdf',
        size: '6.2 MB',
        language: 'FR'
      }
    ],
    compatibility: ['Chaudières gaz', 'Pompes à chaleur', 'Radiateurs électriques', 'SpiderHome Hub'],
    relatedProducts: ['2', '3', '4'],
    metaTitle: 'Thermostat connecté intelligent TCI-200 - SpiderHome',
    metaDescription: 'Thermostat intelligent avec IA intégrée. Apprentissage automatique, économies d\'énergie, contrôle à distance.'
  },
  {
    id: '6',
    slug: 'camera-surveillance-hd',
    name: 'CAMÉRA DE SURVEILLANCE HD',
    reference: 'CSH-1080',
    category: 'Sécurité',
    shortDescription: 'Caméra de surveillance HD avec vision nocturne',
    longDescription: 'La caméra de surveillance HD CSH-1080 offre une surveillance 24h/24 avec vision nocturne infrarouge. Détection de mouvement intelligente et stockage cloud sécurisé.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Caméra de surveillance HD CSH-1080',
        thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'eye',
        title: 'Vision nocturne',
        description: 'Surveillance 24h/24 avec infrarouge'
      },
      {
        icon: 'shield',
        title: 'Détection IA',
        description: 'Reconnaissance intelligente des mouvements'
      },
      {
        icon: 'cloud',
        title: 'Stockage sécurisé',
        description: 'Enregistrement cloud avec chiffrement'
      }
    ],
    specifications: [
      { name: 'Résolution', value: '1920x1080', unit: 'pixels' },
      { name: 'Objectif', value: '3.6', unit: 'mm' },
      { name: 'Vision nocturne', value: '30', unit: 'm' },
      { name: 'Angle de vue', value: '90', unit: '°' },
      { name: 'Connectivité', value: 'Wi-Fi 802.11n' },
      { name: 'Alimentation', value: '12V DC' },
      { name: 'Dimensions', value: '80 x 80 x 120', unit: 'mm' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique CSH-1080',
        type: 'pdf',
        url: '/downloads/CSH-1080-fiche-technique.pdf',
        size: '2.5 MB',
        language: 'FR'
      }
    ],
    compatibility: ['SpiderHome Hub', 'Applications mobiles', 'Stockage cloud'],
    relatedProducts: ['7', '8'],
    metaTitle: 'Caméra surveillance HD CSH-1080 - SpiderHome',
    metaDescription: 'Caméra de surveillance HD avec vision nocturne. Détection IA, stockage cloud sécurisé, surveillance 24h/24.'
  },
  {
    id: '7',
    slug: 'detecteur-mouvement-pir',
    name: 'DÉTECTEUR DE MOUVEMENT PIR',
    reference: 'DMP-360',
    category: 'Sécurité',
    shortDescription: 'Détecteur de mouvement PIR avec portée 12m',
    longDescription: 'Le détecteur de mouvement PIR DMP-360 offre une détection fiable sur 12 mètres avec immunité aux animaux domestiques. Design discret et installation sans fil.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Détecteur de mouvement PIR DMP-360',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'eye',
        title: 'Portée étendue',
        description: 'Détection fiable sur 12 mètres'
      },
      {
        icon: 'shield',
        title: 'Immunité animaux',
        description: 'Évite les fausses alertes avec les animaux'
      },
      {
        icon: 'wifi',
        title: 'Sans fil',
        description: 'Installation simple sans câblage'
      }
    ],
    specifications: [
      { name: 'Portée de détection', value: '12', unit: 'm' },
      { name: 'Angle de détection', value: '360', unit: '°' },
      { name: 'Hauteur de détection', value: '2.2', unit: 'm' },
      { name: 'Temps de réaction', value: '0.3', unit: 's' },
      { name: 'Autonomie batterie', value: '2', unit: 'ans' },
      { name: 'Connectivité', value: 'Zigbee 3.0' },
      { name: 'Dimensions', value: '65 x 65 x 25', unit: 'mm' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique DMP-360',
        type: 'pdf',
        url: '/downloads/DMP-360-fiche-technique.pdf',
        size: '1.6 MB',
        language: 'FR'
      }
    ],
    compatibility: ['SpiderHome Hub', 'Systèmes d\'alarme', 'Éclairage automatique'],
    relatedProducts: ['6', '8'],
    metaTitle: 'Détecteur mouvement PIR DMP-360 - SpiderHome',
    metaDescription: 'Détecteur de mouvement PIR avec portée 12m. Immunité animaux, sans fil, autonomie 2 ans.'
  },
  {
    id: '8',
    slug: 'hub-central-spiderhome',
    name: 'HUB CENTRAL SPIDERHOME',
    reference: 'HCS-500',
    category: 'Contrôleurs',
    shortDescription: 'Centre de contrôle principal de votre maison connectée',
    longDescription: 'Le Hub Central SpiderHome HCS-500 est le cerveau de votre installation domotique. Il centralise tous vos appareils connectés et offre une interface intuitive pour contrôler votre maison intelligente.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Hub Central SpiderHome HCS-500',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'cpu',
        title: 'Cerveau central',
        description: 'Contrôle tous vos appareils connectés'
      },
      {
        icon: 'shield',
        title: 'Sécurité maximale',
        description: 'Chiffrement AES-256 et sauvegarde cloud'
      },
      {
        icon: 'smartphone',
        title: 'Interface intuitive',
        description: 'Application mobile et web responsive'
      }
    ],
    specifications: [
      { name: 'Processeur', value: 'ARM Cortex-A72' },
      { name: 'Mémoire', value: '4', unit: 'GB RAM' },
      { name: 'Stockage', value: '32', unit: 'GB eMMC' },
      { name: 'Connectivité', value: 'Wi-Fi 6, Ethernet, Zigbee, Z-Wave' },
      { name: 'Ports', value: '4x USB 3.0, 1x HDMI' },
      { name: 'Alimentation', value: '12V DC' },
      { name: 'Dimensions', value: '150 x 100 x 30', unit: 'mm' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique HCS-500',
        type: 'pdf',
        url: '/downloads/HCS-500-fiche-technique.pdf',
        size: '3.2 MB',
        language: 'FR'
      },
      {
        id: '2',
        name: 'Guide de configuration',
        type: 'manual',
        url: '/downloads/HCS-500-guide-configuration.pdf',
        size: '8.1 MB',
        language: 'FR'
      }
    ],
    compatibility: ['Tous appareils SpiderHome', 'Amazon Alexa', 'Google Home', 'Apple HomeKit'],
    relatedProducts: ['1', '4', '5'],
    featured: true,
    metaTitle: 'Hub Central SpiderHome HCS-500 - SpiderHome',
    metaDescription: 'Hub central pour maison connectée. Contrôle tous vos appareils, sécurité maximale, interface intuitive.'
  },
  {
    id: '9',
    slug: 'interrupteur-connecte-touch',
    name: 'INTERRUPTEUR CONNECTÉ TOUCH',
    reference: 'ICT-001',
    category: 'Éclairage',
    shortDescription: 'Interrupteur tactile connecté avec contrôle intelligent',
    longDescription: 'L\'interrupteur connecté tactile ICT-001 remplace vos interrupteurs traditionnels avec style et intelligence. Contrôle tactile, programmation horaire et intégration domotique complète.',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Interrupteur connecté tactile ICT-001',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ],
    benefits: [
      {
        icon: 'touch',
        title: 'Interface tactile',
        description: 'Contrôle intuitif par simple effleurement'
      },
      {
        icon: 'clock',
        title: 'Programmation',
        description: 'Scénarios horaires et automatisation'
      },
      {
        icon: 'smartphone',
        title: 'Contrôle à distance',
        description: 'Gestion complète depuis votre mobile'
      }
    ],
    specifications: [
      { name: 'Puissance max', value: '2000', unit: 'W' },
      { name: 'Tension', value: '230', unit: 'V AC' },
      { name: 'Courant max', value: '10', unit: 'A' },
      { name: 'Connectivité', value: 'Wi-Fi 802.11n' },
      { name: 'Installation', value: 'Boîte encastrée standard' },
      { name: 'Dimensions', value: '86 x 86 x 35', unit: 'mm' },
      { name: 'Certification', value: 'CE, NF' }
    ],
    downloads: [
      {
        id: '1',
        name: 'Fiche technique ICT-001',
        type: 'pdf',
        url: '/downloads/ICT-001-fiche-technique.pdf',
        size: '2.0 MB',
        language: 'FR'
      },
      {
        id: '2',
        name: 'Manuel d\'installation',
        type: 'manual',
        url: '/downloads/ICT-001-manuel-installation.pdf',
        size: '4.7 MB',
        language: 'FR'
      }
    ],
    compatibility: ['Éclairage LED', 'Éclairage halogène', 'SpiderHome Hub'],
    relatedProducts: ['4', '8'],
    metaTitle: 'Interrupteur connecté tactile ICT-001 - SpiderHome',
    metaDescription: 'Interrupteur tactile connecté avec contrôle intelligent. Interface tactile, programmation, contrôle à distance.'
  }
];

export const categories = [
  { id: 'all', name: 'Tous les produits', slug: 'all' },
  { id: 'interfaces', name: 'Interfaces', slug: 'interfaces' },
  { id: 'mesure', name: 'Mesure', slug: 'mesure' },
  { id: 'eclairage', name: 'Éclairage', slug: 'eclairage' },
  { id: 'climatisation', name: 'Climatisation', slug: 'climatisation' },
  { id: 'securite', name: 'Sécurité', slug: 'securite' },
  { id: 'controleurs', name: 'Contrôleurs', slug: 'controleurs' }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  if (categorySlug === 'all') return products;
  return products.filter(product => product.category.toLowerCase() === categorySlug);
};

export const getRelatedProducts = (productId: string): Product[] => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  
  return products.filter(p => 
    product.relatedProducts.includes(p.id) && p.id !== productId
  );
};
