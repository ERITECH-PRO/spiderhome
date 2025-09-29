import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import { testConnection, initializeTables, createDefaultAdmin } from './dist/config/database.js';
import { authenticateUser, getClientIP } from './dist/utils/auth.js';
import {
  requireAuth,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
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

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

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

// Upload route for single image
app.post('/api/admin/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
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
    
    const uploadedFiles = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
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
    await getProducts(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
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
  
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📱 Site vitrine: http://localhost:${PORT}`);
    console.log(`🔐 Administration: http://localhost:${PORT}/admin`);
    console.log(`👤 Admin: admin_spiderhome / Industrial2024`);
  });
}

startServer().catch(console.error);