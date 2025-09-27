import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Configuration de la base de données distante
const dbConfig = {
  host: '185.183.35.80',
  port: 3307,
  user: 'root',
  password: 'StrongPassword123',
  database: 'sp_base',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let useDatabase = false;

// Données de démonstration pré-remplies
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
    reference: 'SPD-001',
    description: 'Interface de signalisation connectée pour la domotique résidentielle et industrielle.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Interfaces',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title: 'Capteur de Mouvement Intelligent',
    reference: 'SPD-002',
    description: 'Capteur de mouvement avec détection de présence et communication WiFi.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Capteurs',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    title: 'Module de Contrôle Éclairage',
    reference: 'SPD-003',
    description: 'Module de contrôle d\'éclairage intelligent avec gradation et programmation.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Contrôleurs',
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
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title: 'Votre maison, sécurisée',
    subtitle: 'Système de sécurité intelligent',
    cta_text: 'Découvrir la sécurité intelligente',
    cta_link: '/products',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    title: 'Maîtrisez votre énergie',
    subtitle: 'Gestion intelligente de l\'énergie',
    cta_text: 'Voir comment ça marche',
    cta_link: '/features',
    image_url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&h=1080&fit=crop',
    created_at: new Date(),
    updated_at: new Date()
  }
];

let blogs = [
  {
    id: 1,
    title: 'Introduction à la domotique SpiderHome',
    slug: 'introduction-domotique-spiderhome',
    content: 'Découvrez comment SpiderHome révolutionne la gestion de votre habitat avec des solutions intelligentes et connectées.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title: 'Les avantages de la maison connectée',
    slug: 'avantages-maison-connectee',
    content: 'Explorez tous les bénéfices d\'une maison intelligente : confort, sécurité, économies d\'énergie et bien plus.',
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    created_at: new Date(),
    updated_at: new Date()
  }
];

let features = [
  {
    id: 1,
    title: 'Contrôle à distance',
    description: 'Gérez votre maison depuis n\'importe où avec notre application mobile intuitive.',
    icon_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title: 'Sécurité avancée',
    description: 'Système de sécurité intelligent avec détection de mouvement et alertes en temps réel.',
    icon_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    title: 'Économies d\'énergie',
    description: 'Optimisez votre consommation d\'énergie avec des solutions intelligentes et automatisées.',
    icon_url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=100',
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Fonction pour tester la connexion à la base de données
async function testDatabaseConnection() {
  try {
    console.log('🔄 Test de connexion à la base de données MySQL distante...');
    pool = mysql.createPool(dbConfig);
    
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données MySQL distante réussie !');
    connection.release();
    
    // Initialiser les tables
    await initializeTables();
    await createDefaultAdmin();
    
    useDatabase = true;
    console.log('💾 Mode : Base de données MySQL distante');
    return true;
  } catch (error) {
    console.warn('⚠️ Impossible de se connecter à la base de données MySQL distante');
    console.log('🔄 Mode démonstration activé avec données pré-remplies');
    console.log('💾 Mode : Données en mémoire (démonstration)');
    useDatabase = false;
    return false;
  }
}

// Fonction pour initialiser les tables
async function initializeTables() {
  try {
    const connection = await pool.getConnection();
    
    // Table users
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Table products
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        reference VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Table slides
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        cta_text VARCHAR(100) NOT NULL,
        cta_link VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Table blogs
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Table features
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    connection.release();
    console.log('✅ Tables de base de données initialisées avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des tables:', error);
    return false;
  }
}

// Fonction pour créer l'utilisateur admin par défaut
async function createDefaultAdmin() {
  try {
    const bcrypt = await import('bcryptjs');
    const connection = await pool.getConnection();
    
    // Vérifier si l'admin existe déjà
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin_spiderhome']
    );
    
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('Industrial2024', 12);
      
      await connection.execute(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        ['admin_spiderhome', hashedPassword, 'admin']
      );
      
      console.log('✅ Utilisateur admin par défaut créé');
    } else {
      console.log('ℹ️ Utilisateur admin existe déjà');
    }
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    return false;
  }
}

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
    
    let user;
    
    if (useDatabase) {
      // Utiliser la base de données
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      connection.release();
      
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Identifiants incorrects' 
        });
      }
      
      user = users[0];
    } else {
      // Utiliser les données en mémoire
      user = users.find(u => u.username === username);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Identifiants incorrects' 
        });
      }
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
app.get('/api/admin/products', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [products] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
      connection.release();
      res.json(products);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

app.get('/api/admin/products/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (products.length === 0) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
      res.json(products[0]);
    } else {
      const product = products.find(p => p.id === parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

app.post('/api/admin/products', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO products (title, reference, description, image_url, category) VALUES (?, ?, ?, ?, ?)',
        [req.body.title, req.body.reference, req.body.description, req.body.image_url, req.body.category]
      );
      connection.release();
      
      const newProduct = {
        id: result.insertId,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      res.json(newProduct);
    } else {
      const newProduct = {
        id: products.length + 1,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      products.push(newProduct);
      res.json(newProduct);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

app.put('/api/admin/products/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE products SET title = ?, reference = ?, description = ?, image_url = ?, category = ? WHERE id = ?',
        [req.body.title, req.body.reference, req.body.description, req.body.image_url, req.body.category, req.params.id]
      );
      
      const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (products.length === 0) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
      res.json(products[0]);
    } else {
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
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
      res.json({ success: true });
    } else {
      const index = products.findIndex(p => p.id === parseInt(req.params.id));
      if (index === -1) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }
      
      products.splice(index, 1);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

// Routes Slides
app.get('/api/admin/slides', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [slides] = await connection.execute('SELECT * FROM slides ORDER BY created_at DESC');
      connection.release();
      res.json(slides);
    } else {
      res.json(slides);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des slides' });
  }
});

app.post('/api/admin/slides', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO slides (title, subtitle, cta_text, cta_link, image_url) VALUES (?, ?, ?, ?, ?)',
        [req.body.title, req.body.subtitle, req.body.cta_text, req.body.cta_link, req.body.image_url]
      );
      connection.release();
      
      const newSlide = {
        id: result.insertId,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      res.json(newSlide);
    } else {
      const newSlide = {
        id: slides.length + 1,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      slides.push(newSlide);
      res.json(newSlide);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du slide' });
  }
});

app.put('/api/admin/slides/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE slides SET title = ?, subtitle = ?, cta_text = ?, cta_link = ?, image_url = ? WHERE id = ?',
        [req.body.title, req.body.subtitle, req.body.cta_text, req.body.cta_link, req.body.image_url, req.params.id]
      );
      
      const [slides] = await connection.execute('SELECT * FROM slides WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (slides.length === 0) {
        return res.status(404).json({ error: 'Slide non trouvé' });
      }
      res.json(slides[0]);
    } else {
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
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du slide' });
  }
});

app.delete('/api/admin/slides/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute('DELETE FROM slides WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Slide non trouvé' });
      }
      res.json({ success: true });
    } else {
      const index = slides.findIndex(s => s.id === parseInt(req.params.id));
      if (index === -1) {
        return res.status(404).json({ error: 'Slide non trouvé' });
      }
      
      slides.splice(index, 1);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du slide' });
  }
});

// Routes Blog
app.get('/api/admin/blogs', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [blogs] = await connection.execute('SELECT * FROM blogs ORDER BY created_at DESC');
      connection.release();
      res.json(blogs);
    } else {
      res.json(blogs);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
});

app.post('/api/admin/blogs', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO blogs (title, slug, content, image_url) VALUES (?, ?, ?, ?)',
        [req.body.title, req.body.slug, req.body.content, req.body.image_url]
      );
      connection.release();
      
      const newBlog = {
        id: result.insertId,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      res.json(newBlog);
    } else {
      const newBlog = {
        id: blogs.length + 1,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      blogs.push(newBlog);
      res.json(newBlog);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
  }
});

app.put('/api/admin/blogs/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE blogs SET title = ?, slug = ?, content = ?, image_url = ? WHERE id = ?',
        [req.body.title, req.body.slug, req.body.content, req.body.image_url, req.params.id]
      );
      
      const [blogs] = await connection.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (blogs.length === 0) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
      res.json(blogs[0]);
    } else {
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
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
  }
});

app.delete('/api/admin/blogs/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute('DELETE FROM blogs WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
      res.json({ success: true });
    } else {
      const index = blogs.findIndex(b => b.id === parseInt(req.params.id));
      if (index === -1) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
      
      blogs.splice(index, 1);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
  }
});

// Routes Features
app.get('/api/admin/features', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [features] = await connection.execute('SELECT * FROM features ORDER BY created_at DESC');
      connection.release();
      res.json(features);
    } else {
      res.json(features);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des fonctionnalités' });
  }
});

app.post('/api/admin/features', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO features (title, description, icon_url) VALUES (?, ?, ?)',
        [req.body.title, req.body.description, req.body.icon_url]
      );
      connection.release();
      
      const newFeature = {
        id: result.insertId,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      res.json(newFeature);
    } else {
      const newFeature = {
        id: features.length + 1,
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };
      features.push(newFeature);
      res.json(newFeature);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la fonctionnalité' });
  }
});

app.put('/api/admin/features/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE features SET title = ?, description = ?, icon_url = ? WHERE id = ?',
        [req.body.title, req.body.description, req.body.icon_url, req.params.id]
      );
      
      const [features] = await connection.execute('SELECT * FROM features WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (features.length === 0) {
        return res.status(404).json({ error: 'Fonctionnalité non trouvée' });
      }
      res.json(features[0]);
    } else {
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
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la fonctionnalité' });
  }
});

app.delete('/api/admin/features/:id', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [result] = await connection.execute('DELETE FROM features WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Fonctionnalité non trouvée' });
      }
      res.json({ success: true });
    } else {
      const index = features.findIndex(f => f.id === parseInt(req.params.id));
      if (index === -1) {
        return res.status(404).json({ error: 'Fonctionnalité non trouvée' });
      }
      
      features.splice(index, 1);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la fonctionnalité' });
  }
});

// Dashboard
app.get('/api/admin/dashboard/stats', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      
      const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
      const [slideCount] = await connection.execute('SELECT COUNT(*) as count FROM slides');
      const [blogCount] = await connection.execute('SELECT COUNT(*) as count FROM blogs');
      const [featureCount] = await connection.execute('SELECT COUNT(*) as count FROM features');
      
      connection.release();
      
      res.json({
        products: productCount[0].count,
        slides: slideCount[0].count,
        blogs: blogCount[0].count,
        features: featureCount[0].count
      });
    } else {
      res.json({
        products: products.length,
        slides: slides.length,
        blogs: blogs.length,
        features: features.length
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Routes publiques pour le site vitrine
app.get('/api/products', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [products] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
      connection.release();
      res.json(products);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

app.get('/api/slides', async (req, res) => {
  try {
    if (useDatabase) {
      const connection = await pool.getConnection();
      const [slides] = await connection.execute('SELECT * FROM slides ORDER BY created_at DESC');
      connection.release();
      res.json(slides);
    } else {
      res.json(slides);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des slides' });
  }
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
async function startServer() {
  await testDatabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📱 Site vitrine: http://localhost:${PORT}`);
    console.log(`🔐 Administration: http://localhost:${PORT}/admin`);
    console.log(`👤 Admin: admin_spiderhome / Industrial2024`);
    console.log(`📊 Données de démonstration pré-remplies :`);
    console.log(`   - ${products.length} produits`);
    console.log(`   - ${slides.length} slides`);
    console.log(`   - ${blogs.length} articles de blog`);
    console.log(`   - ${features.length} fonctionnalités`);
  });
}

startServer().catch(console.error);
