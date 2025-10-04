import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import { testConnection, initializeTables, createDefaultAdmin, pool } from './dist/config/database.js';
import { authenticateUser, getClientIP } from './dist/utils/auth.js';
import {
  requireAuth,
  getProducts,
  getProductsPublic,
  getProduct,
  getProductBySlug,
  searchProducts,
  getRelatedBySlug,
  getProductComplete,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductVisibility,
  getSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  getDashboardStats
} from './dist/api/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure multer for PDF uploads
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for PDFs
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cache headers pour les assets statiques
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y', // Cache 1 an pour les assets
  etag: true,
  lastModified: true
}));

// Cache headers pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), {
  maxAge: '30d', // Cache 30 jours pour les images
  etag: true,
  lastModified: true
}));

// Cache simple en mémoire
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Nettoyer le cache périodiquement
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);

// Ensure categories table exists (without requiring a rebuild)
async function ensureCategoriesTable() {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) UNIQUE NOT NULL,
        subcategories JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('✅ Table categories prête');
  } catch (error) {
    console.error('❌ Erreur création table categories:', error);
  }
}

// Routes API Admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = getClientIP(req);
    
    const result = await authenticateUser(username, password, ip);
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
app.get('/api/admin/products', getProducts);
app.get('/api/admin/products/:id', getProduct);
app.post('/api/admin/products', createProduct);
app.put('/api/admin/products/:id', updateProduct);
app.delete('/api/admin/products/:id', deleteProduct);
app.patch('/api/admin/products/:id/visibility', updateProductVisibility);

// Routes Categories (Admin)
app.get('/api/admin/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT id, name, subcategories, created_at, updated_at FROM categories ORDER BY name ASC');
    connection.release();
    const normalized = (rows || []).map((c) => ({
      ...c,
      subcategories: typeof c.subcategories === 'string' ? (function(){try{return JSON.parse(c.subcategories)}catch{ return []}})() : (c.subcategories || [])
    }));
    res.json(normalized);
  } catch (error) {
    console.error('Erreur list categories:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/admin/categories', async (req, res) => {
  try {
    const { name, subcategories } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO categories (name, subcategories) VALUES (?, ?)',
      [String(name).trim(), JSON.stringify(Array.isArray(subcategories) ? subcategories : [])]
    );
    connection.release();
    res.status(201).json({ id: (result).insertId, name: String(name).trim(), subcategories: Array.isArray(subcategories) ? subcategories : [] });
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.put('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subcategories } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE categories SET name = ?, subcategories = ? WHERE id = ?',
      [String(name).trim(), JSON.stringify(Array.isArray(subcategories) ? subcategories : []), id]
    );
    connection.release();
    res.json({ id: Number(id), name: String(name).trim(), subcategories: Array.isArray(subcategories) ? subcategories : [] });
  } catch (error) {
    console.error('Erreur mise à jour catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.delete('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM categories WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route publique (optionnelle) pour récupérer les catégories
app.get('/api/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT id, name, subcategories FROM categories ORDER BY name ASC');
    connection.release();
    const normalized = (rows || []).map((c) => ({
      id: c.id,
      name: c.name,
      subcategories: typeof c.subcategories === 'string' ? (function(){try{return JSON.parse(c.subcategories)}catch{ return []}})() : (c.subcategories || [])
    }));
    res.json(normalized);
  } catch (error) {
    console.error('Erreur publique categories:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Upload route for single image
app.post('/api/admin/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Get the full URL including protocol and host
    const protocol = req.protocol;
    const host = process.env.DB_HOST || req.get('host');
    const port = process.env.PORT || '3003';
    const fileUrl = `${protocol}://${host}:${port}/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload route for multiple images
app.post('/api/admin/upload-multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Get the full URL including protocol and host
    const protocol = req.protocol;
    const host = process.env.DB_HOST || req.get('host');
    const port = process.env.PORT || '3003';
    
    const uploadedFiles = req.files.map(file => ({
      url: `${protocol}://${host}:${port}/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));
    
    res.json({ 
      success: true, 
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload route for PDF files
app.post('/api/admin/upload-pdf', uploadPdf.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    // Get the full URL including protocol and host
    const protocol = req.protocol;
    const host = process.env.DB_HOST || req.get('host');
    const port = process.env.PORT || '3003';
    const fileUrl = `${protocol}://${host}:${port}/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('PDF Upload error:', error);
    res.status(500).json({ error: 'PDF upload failed' });
  }
});

// Routes Slides
app.get('/api/admin/slides', getSlides);
app.get('/api/admin/slides/:id', getSlideById);
app.post('/api/admin/slides', createSlide);
app.put('/api/admin/slides/:id', updateSlide);
app.delete('/api/admin/slides/:id', deleteSlide);

// Routes Blog
app.get('/api/admin/blogs', getBlogs);
app.get('/api/admin/blogs/:id', getBlogById);
app.post('/api/admin/blogs', createBlog);
app.put('/api/admin/blogs/:id', updateBlog);
app.delete('/api/admin/blogs/:id', deleteBlog);

// Routes Features
app.get('/api/admin/features', getFeatures);
app.post('/api/admin/features', createFeature);
app.put('/api/admin/features/:id', updateFeature);
app.delete('/api/admin/features/:id', deleteFeature);

// Dashboard
app.get('/api/admin/dashboard/stats', getDashboardStats);

// Routes publiques pour le site vitrine
app.get('/api/products', async (req, res) => {
  try {
    // Cache key basé sur les paramètres de requête
    const cacheKey = `products_${JSON.stringify(req.query)}`;
    const cached = getCached(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }
    
    // Si pas en cache, exécuter la requête
    const originalSend = res.json;
    res.json = function(data) {
      setCache(cacheKey, data);
      return originalSend.call(this, data);
    };
    
    await getProductsPublic(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// Recherche de produits
app.get('/api/products/search', async (req, res) => {
  try {
    await searchProducts(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recherche des produits' });
  }
});

// Produit complet par slug (parsing JSON inclus)
app.get('/api/products/slug/:slug', async (req, res) => {
  try {
    await getProductComplete(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

// Produit par slug (lecture directe table products)
app.get('/api/products/:slug', async (req, res) => {
  try {
    const cacheKey = `product_${req.params.slug}`;
    const cached = getCached(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }
    
    const originalSend = res.json;
    res.json = function(data) {
      setCache(cacheKey, data);
      return originalSend.call(this, data);
    };
    
    await getProductBySlug(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

// Produits associés
app.get('/api/products/:slug/related', async (req, res) => {
  try {
    await getRelatedBySlug(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits associés' });
  }
});

app.get('/api/slides', async (req, res) => {
  try {
    await getSlides(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des slides' });
  }
});

app.get('/api/features', async (req, res) => {
  try {
    await getFeatures(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des fonctionnalités' });
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

// Initialisation de la base de données
async function initializeDatabase() {
  console.log('🔄 Initialisation de la base de données...');
  
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Impossible de se connecter à la base de données MySQL distante');
    console.error('❌ Le serveur ne peut pas démarrer sans connexion à la base de données');
    process.exit(1);
  }
  
  const tablesCreated = await initializeTables();
  if (!tablesCreated) {
    console.error('❌ Erreur lors de la création des tables');
    process.exit(1);
  }
  
  const adminCreated = await createDefaultAdmin();
  if (!adminCreated) {
    console.error('❌ Erreur lors de la création de l\'admin par défaut');
    process.exit(1);
  }
  
  console.log('✅ Base de données initialisée avec succès');
}

// Démarrage du serveur
async function startServer() {
  await initializeDatabase();
  await ensureCategoriesTable();
  
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📱 Site vitrine: http://localhost:${PORT}`);
    console.log(`🔐 Administration: http://localhost:${PORT}/admin`);
    console.log(`👤 Admin: admin_spiderhome / Industrial2024`);
  });
}

startServer().catch(console.error);