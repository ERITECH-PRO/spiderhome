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

// Données en mémoire pour la démonstration
let demoData = {
  products: [
    {
      id: 1,
      title: "Interface Signalisation Wi-Fi",
      slug: "interface-signalisation-wifi",
      reference: "SH-IF-001",
      category: "Interfaces",
      short_description: "Interface de signalisation connectée Wi-Fi pour la domotique",
      long_description: "Interface de signalisation Wi-Fi permettant de contrôler les signaux lumineux et sonores de votre installation domotique.",
      image_url: "/placeholder-product.jpg",
      specifications: [
        { name: "Connectivité", value: "Wi-Fi 802.11n", unit: "" },
        { name: "Tension", value: "12-24V", unit: "DC" },
        { name: "Consommation", value: "2.5", unit: "W" }
      ],
      benefits: [
        { icon: "wifi", title: "Connectivité Wi-Fi", description: "Contrôle à distance via smartphone" },
        { icon: "settings", title: "Configuration simple", description: "Installation et paramétrage facilités" }
      ],
      downloads: [],
      compatibility: ["SpiderHome Hub", "Modules d'éclairage"],
      related_products: [],
      is_new: true,
      featured: true,
      meta_title: "Interface Signalisation Wi-Fi - SpiderHome",
      meta_description: "Interface de signalisation connectée Wi-Fi pour la domotique SpiderHome"
    }
  ],
  slides: [
    {
      id: 1,
      title: "Votre maison, connectée intelligemment",
      subtitle: "Contrôlez votre maison depuis n'importe où",
      cta_text: "Demander une démo",
      cta_link: "/contact",
      image_url: "/placeholder-slide.jpg",
      alt_text: "Maison connectée SpiderHome",
      order_index: 1,
      is_active: true
    }
  ],
  blogs: [
    {
      id: 1,
      title: "Bienvenue sur SpiderHome",
      slug: "bienvenue-spiderhome",
      content: "Bienvenue sur le blog SpiderHome. Découvrez nos dernières actualités et conseils en domotique.",
      excerpt: "Découvrez SpiderHome et ses solutions de domotique intelligente.",
      image_url: "/placeholder-blog.jpg",
      author: "SpiderHome",
      status: "published",
      meta_title: "Bienvenue sur SpiderHome",
      meta_description: "Découvrez SpiderHome et ses solutions de domotique intelligente"
    }
  ],
  features: [
    {
      id: 1,
      title: "Contrôle intelligent",
      description: "Gérez tous vos équipements depuis une interface unique",
      icon: "settings",
      icon_url: "",
      order_index: 1,
      is_active: true
    }
  ],
  users: [
    {
      id: 1,
      username: "admin_spiderhome",
      password_hash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K", // Industrial2024
      role: "admin"
    }
  ]
};

// Fonction d'authentification simplifiée
const authenticateUser = async (username, password) => {
  const user = demoData.users.find(u => u.username === username);
  if (!user) {
    return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
  }
  
  // Pour la démo, on accepte le mot de passe en clair
  if (password === 'Industrial2024') {
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
    })).toString('base64');
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token
    };
  }
  
  return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
};

// Middleware d'authentification
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }
  
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      return res.status(401).json({ error: 'Token expiré' });
    }
    
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// Routes API Admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authenticateUser(username, password);
    res.json(result);
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
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
  res.json(demoData.products);
});

app.get('/api/admin/products/:id', (req, res) => {
  const product = demoData.products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  res.json(product);
});

app.post('/api/admin/products', (req, res) => {
  const newProduct = {
    id: Math.max(...demoData.products.map(p => p.id), 0) + 1,
    ...req.body
  };
  demoData.products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', (req, res) => {
  const index = demoData.products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  demoData.products[index] = { ...demoData.products[index], ...req.body };
  res.json(demoData.products[index]);
});

app.delete('/api/admin/products/:id', (req, res) => {
  const index = demoData.products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }
  demoData.products.splice(index, 1);
  res.json({ message: 'Produit supprimé avec succès' });
});

// Routes Slides
app.get('/api/admin/slides', (req, res) => {
  res.json(demoData.slides);
});

app.post('/api/admin/slides', (req, res) => {
  const newSlide = {
    id: Math.max(...demoData.slides.map(s => s.id), 0) + 1,
    ...req.body
  };
  demoData.slides.push(newSlide);
  res.status(201).json(newSlide);
});

app.put('/api/admin/slides/:id', (req, res) => {
  const index = demoData.slides.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Slide non trouvé' });
  }
  demoData.slides[index] = { ...demoData.slides[index], ...req.body };
  res.json(demoData.slides[index]);
});

app.delete('/api/admin/slides/:id', (req, res) => {
  const index = demoData.slides.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Slide non trouvé' });
  }
  demoData.slides.splice(index, 1);
  res.json({ message: 'Slide supprimé avec succès' });
});

// Routes Blog
app.get('/api/admin/blogs', (req, res) => {
  res.json(demoData.blogs);
});

app.post('/api/admin/blogs', (req, res) => {
  const newBlog = {
    id: Math.max(...demoData.blogs.map(b => b.id), 0) + 1,
    ...req.body
  };
  demoData.blogs.push(newBlog);
  res.status(201).json(newBlog);
});

app.put('/api/admin/blogs/:id', (req, res) => {
  const index = demoData.blogs.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Article non trouvé' });
  }
  demoData.blogs[index] = { ...demoData.blogs[index], ...req.body };
  res.json(demoData.blogs[index]);
});

app.delete('/api/admin/blogs/:id', (req, res) => {
  const index = demoData.blogs.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Article non trouvé' });
  }
  demoData.blogs.splice(index, 1);
  res.json({ message: 'Article supprimé avec succès' });
});

// Routes Features
app.get('/api/admin/features', (req, res) => {
  res.json(demoData.features);
});

app.post('/api/admin/features', (req, res) => {
  const newFeature = {
    id: Math.max(...demoData.features.map(f => f.id), 0) + 1,
    ...req.body
  };
  demoData.features.push(newFeature);
  res.status(201).json(newFeature);
});

app.put('/api/admin/features/:id', (req, res) => {
  const index = demoData.features.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Fonctionnalité non trouvée' });
  }
  demoData.features[index] = { ...demoData.features[index], ...req.body };
  res.json(demoData.features[index]);
});

app.delete('/api/admin/features/:id', (req, res) => {
  const index = demoData.features.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Fonctionnalité non trouvée' });
  }
  demoData.features.splice(index, 1);
  res.json({ message: 'Fonctionnalité supprimée avec succès' });
});

// Dashboard
app.get('/api/admin/dashboard/stats', (req, res) => {
  res.json({
    products: demoData.products.length,
    slides: demoData.slides.filter(s => s.is_active).length,
    blogs: demoData.blogs.filter(b => b.status === 'published').length,
    features: demoData.features.filter(f => f.is_active).length
  });
});

// Routes publiques pour le site vitrine
app.get('/api/products', (req, res) => {
  res.json(demoData.products);
});

app.get('/api/slides', (req, res) => {
  res.json(demoData.slides.filter(s => s.is_active));
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
  console.log('🚀 Serveur de démonstration démarré sur le port', PORT);
  console.log('📱 Site vitrine: http://localhost:' + PORT);
  console.log('🔐 Administration: http://localhost:' + PORT + '/admin');
  console.log('👤 Admin: admin_spiderhome / Industrial2024');
  console.log('💾 Mode: Données en mémoire (démonstration)');
});
