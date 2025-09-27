import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Données en mémoire pour le mode démonstration
let users = [
  {
    id: 1,
    username: 'admin_spiderhome',
    password_hash: '$2b$12$yR/mEJUyEcx5URT1FiVW0.NH8nGBcNOtKj7M2Igyx2b6tOCxZ3OTu', // Industrial2024
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date()
  }
];

let products = [
  {
    id: 1,
    title: 'Interface de Signalisation WiFi',
    slug: 'interface-signalisation-wifi',
    reference: 'SP-WIFI-001',
    category: 'Interfaces',
    short_description: 'Interface de signalisation WiFi pour la domotique',
    long_description: 'Interface de signalisation WiFi avancée permettant de contrôler et signaler l\'état de vos équipements domotiques via votre réseau WiFi.',
    image_url: '/placeholder-product.jpg',
    specifications: {
      "Connectivité": "WiFi 802.11 b/g/n",
      "Alimentation": "12V DC",
      "Consommation": "2W max",
      "Dimensions": "120 x 80 x 25 mm"
    },
    benefits: [
      "Installation simple et rapide",
      "Contrôle à distance via smartphone",
      "Intégration domotique complète"
    ],
    downloads: [
      {
        name: "Manuel d'installation",
        url: "/downloads/manuel-installation.pdf",
        type: "PDF"
      }
    ],
    compatibility: ["SpiderHome Hub", "OpenHAB", "Home Assistant"],
    related_products: [2, 3],
    is_new: true,
    featured: true,
    meta_title: "Interface Signalisation WiFi - SpiderHome",
    meta_description: "Interface de signalisation WiFi pour la domotique SpiderHome",
    created_at: new Date(),
    updated_at: new Date()
  }
];

let slides = [
  {
    id: 1,
    title: 'Votre maison, connectée intelligemment',
    subtitle: 'Découvrez la domotique SpiderHome',
    cta_text: 'Demander une démo',
    cta_link: '/contact',
    image_url: '/placeholder-slide-1.jpg',
    alt_text: 'Maison connectée SpiderHome',
    order_index: 1,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

let blogs = [];
let features = [];
let loginAttempts = [];

// Fonction pour vérifier le mot de passe
async function verifyPassword(password, hash) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

// Fonction pour générer un token JWT simple
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
  };
  
  // Encodage base64 simple (pour la démonstration)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Fonction pour vérifier un token
function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      return null; // Token expiré
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Middleware d'authentification
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
  
  req.user = payload;
  next();
}

// Route de connexion
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nom d\'utilisateur et mot de passe requis' 
      });
    }
    
    // Rechercher l'utilisateur
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants incorrects' 
      });
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants incorrects' 
      });
    }
    
    // Générer le token
    const token = generateToken(user);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token: token
    });
    
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur interne du serveur' 
    });
  }
});

// Middleware d'authentification pour toutes les routes admin
app.use('/api/admin', (req, res, next) => {
  if (req.path === '/login') {
    return next();
  }
  requireAuth(req, res, next);
});

// Routes Products
app.get('/api/admin/products', (req, res) => {
  res.json(products);
});

app.get('/api/admin/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  res.json(product);
});

app.post('/api/admin/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };
  products.push(newProduct);
  res.json(newProduct);
});

app.put('/api/admin/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  
  products[index] = {
    ...products[index],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(products[index]);
});

app.delete('/api/admin/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  
  products.splice(index, 1);
  res.json({ success: true });
});

// Routes Slides
app.get('/api/admin/slides', (req, res) => {
  res.json(slides);
});

app.post('/api/admin/slides', (req, res) => {
  const newSlide = {
    id: slides.length + 1,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };
  slides.push(newSlide);
  res.json(newSlide);
});

app.put('/api/admin/slides/:id', (req, res) => {
  const index = slides.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Slide non trouvé' });
  }
  
  slides[index] = {
    ...slides[index],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(slides[index]);
});

app.delete('/api/admin/slides/:id', (req, res) => {
  const index = slides.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Slide non trouvé' });
  }
  
  slides.splice(index, 1);
  res.json({ success: true });
});

// Routes Blog
app.get('/api/admin/blogs', (req, res) => {
  res.json(blogs);
});

app.post('/api/admin/blogs', (req, res) => {
  const newBlog = {
    id: blogs.length + 1,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };
  blogs.push(newBlog);
  res.json(newBlog);
});

app.put('/api/admin/blogs/:id', (req, res) => {
  const index = blogs.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Article non trouvé' });
  }
  
  blogs[index] = {
    ...blogs[index],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(blogs[index]);
});

app.delete('/api/admin/blogs/:id', (req, res) => {
  const index = blogs.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Article non trouvé' });
  }
  
  blogs.splice(index, 1);
  res.json({ success: true });
});

// Routes Features
app.get('/api/admin/features', (req, res) => {
  res.json(features);
});

app.post('/api/admin/features', (req, res) => {
  const newFeature = {
    id: features.length + 1,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };
  features.push(newFeature);
  res.json(newFeature);
});

app.put('/api/admin/features/:id', (req, res) => {
  const index = features.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Fonctionnalité non trouvée' });
  }
  
  features[index] = {
    ...features[index],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(features[index]);
});

app.delete('/api/admin/features/:id', (req, res) => {
  const index = features.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Fonctionnalité non trouvée' });
  }
  
  features.splice(index, 1);
  res.json({ success: true });
});

// Dashboard
app.get('/api/admin/dashboard/stats', (req, res) => {
  res.json({
    products: products.length,
    slides: slides.length,
    blogs: blogs.length,
    features: features.length
  });
});

// Routes publiques pour le site vitrine
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/slides', (req, res) => {
  res.json(slides.filter(s => s.is_active));
});

// Route de base
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Route pour servir l'application React (catch-all)
app.use((req, res) => {
  // Ignorer les routes API
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route API non trouvée' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur hybride démarré sur le port ${PORT}`);
  console.log(`📱 Site vitrine: http://localhost:${PORT}`);
  console.log(`🔐 Administration: http://localhost:${PORT}/admin`);
  console.log(`👤 Admin: admin_spiderhome / Industrial2024`);
  console.log(`💾 Mode: Données en mémoire (démonstration)`);
});
