import { pool } from '../config/database.js';
import { verifyToken } from '../utils/auth.js';

// Types pour les données
export interface Product {
  id?: number;
  title: string;
  slug: string;
  reference: string;
  category: string;
  short_description: string;
  long_description: string;
  image_url?: string;
  images?: any[];
  specifications: any[];
  benefits: any[];
  downloads: any[];
  compatibility: string[];
  related_products: string[];
  is_new: boolean;
  featured: boolean;
  meta_title: string;
  meta_description: string;
}

export interface Slide {
  id?: number;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  alt_text: string;
  order_index: number;
  is_active: boolean;
}

export interface Blog {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  status: 'draft' | 'published';
  meta_title: string;
  meta_description: string;
}

export interface Feature {
  id?: number;
  title: string;
  description: string;
  icon: string;
  icon_url: string;
  order_index: number;
  is_active: boolean;
}

// Middleware pour vérifier l'authentification
export const requireAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }
  
  const verification = verifyToken(token);
  if (!verification.valid) {
    return res.status(401).json({ error: verification.message });
  }
  
  req.user = verification.user;
  next();
};

// API Products
export const getProducts = async (req: any, res: any) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ 
      error: 'Erreur interne du serveur', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};

export const getProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
    connection.release();
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const createProduct = async (req: any, res: any) => {
  try {
    const product: Product = req.body;
    const connection = await pool.getConnection();
    
    // Ensure all values are properly defined (not undefined)
    let safeProduct = {
      title: product.title || '',
      slug: product.slug || '',
      reference: product.reference || '',
      category: product.category || '',
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      image_url: product.image_url || null,
      images: product.images || [],
      specifications: product.specifications || [],
      benefits: product.benefits || [],
      downloads: product.downloads || [],
      compatibility: product.compatibility || [],
      related_products: product.related_products || [],
      is_new: product.is_new || false,
      featured: product.featured || false,
      meta_title: product.meta_title || null,
      meta_description: product.meta_description || null
    };

    // Ensure unique slug
    let finalSlug = safeProduct.slug;
    let counter = 1;
    while (true) {
      const [existing] = await connection.execute(
        'SELECT id FROM products WHERE slug = ?',
        [finalSlug]
      );
      
      if ((existing as any[]).length === 0) {
        break; // Slug is unique
      }
      
      // Add counter to make slug unique
      finalSlug = `${safeProduct.slug}-${counter}`;
      counter++;
    }
    
    safeProduct.slug = finalSlug;
    
    const [result] = await connection.execute(
      `INSERT INTO products (title, slug, reference, category, short_description, long_description, 
       image_url, images, specifications, benefits, downloads, compatibility, related_products, 
       is_new, featured, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        safeProduct.title, safeProduct.slug, safeProduct.reference, safeProduct.category,
        safeProduct.short_description, safeProduct.long_description, safeProduct.image_url,
        JSON.stringify(safeProduct.images), JSON.stringify(safeProduct.specifications), 
        JSON.stringify(safeProduct.benefits), JSON.stringify(safeProduct.downloads), 
        JSON.stringify(safeProduct.compatibility), JSON.stringify(safeProduct.related_products), 
        safeProduct.is_new, safeProduct.featured, safeProduct.meta_title, safeProduct.meta_description
      ]
    );
    
    connection.release();
    res.status(201).json({ id: (result as any).insertId, ...safeProduct });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const updateProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const product: Product = req.body;
    const connection = await pool.getConnection();
    
    // Ensure all values are properly defined (not undefined)
    let safeProduct = {
      title: product.title || '',
      slug: product.slug || '',
      reference: product.reference || '',
      category: product.category || '',
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      image_url: product.image_url || null,
      images: product.images || [],
      specifications: product.specifications || [],
      benefits: product.benefits || [],
      downloads: product.downloads || [],
      compatibility: product.compatibility || [],
      related_products: product.related_products || [],
      is_new: product.is_new || false,
      featured: product.featured || false,
      meta_title: product.meta_title || null,
      meta_description: product.meta_description || null
    };

    // Ensure unique slug (check if slug is different and unique)
    const [currentProduct] = await connection.execute(
      'SELECT slug FROM products WHERE id = ?',
      [id]
    );
    
    const currentSlug = (currentProduct as any[])[0]?.slug;
    
    if (safeProduct.slug !== currentSlug) {
      let finalSlug = safeProduct.slug;
      let counter = 1;
      
      while (true) {
        const [existing] = await connection.execute(
          'SELECT id FROM products WHERE slug = ? AND id != ?',
          [finalSlug, id]
        );
        
        if ((existing as any[]).length === 0) {
          break; // Slug is unique
        }
        
        // Add counter to make slug unique
        finalSlug = `${safeProduct.slug}-${counter}`;
        counter++;
      }
      
      safeProduct.slug = finalSlug;
    }
    
    await connection.execute(
      `UPDATE products SET title = ?, slug = ?, reference = ?, category = ?, 
       short_description = ?, long_description = ?, image_url = ?, images = ?, 
       specifications = ?, benefits = ?, downloads = ?, compatibility = ?, related_products = ?, 
       is_new = ?, featured = ?, meta_title = ?, meta_description = ? 
       WHERE id = ?`,
      [
        safeProduct.title, safeProduct.slug, safeProduct.reference, safeProduct.category,
        safeProduct.short_description, safeProduct.long_description, safeProduct.image_url,
        JSON.stringify(safeProduct.images), JSON.stringify(safeProduct.specifications), 
        JSON.stringify(safeProduct.benefits), JSON.stringify(safeProduct.downloads), 
        JSON.stringify(safeProduct.compatibility), JSON.stringify(safeProduct.related_products), 
        safeProduct.is_new, safeProduct.featured, safeProduct.meta_title, safeProduct.meta_description, id
      ]
    );
    
    connection.release();
    res.json({ id: parseInt(id), ...safeProduct });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// API Slides
export const getSlides = async (req: any, res: any) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM slides ORDER BY order_index ASC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des slides:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const getSlideById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM slides WHERE id = ?', [id]);
    connection.release();
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Slide non trouvé' });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du slide:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const createSlide = async (req: any, res: any) => {
  try {
    const slide: Slide = req.body;
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO slides (title, subtitle, cta_text, cta_link, image_url, alt_text, order_index, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [slide.title, slide.subtitle, slide.cta_text, slide.cta_link, slide.image_url, slide.alt_text, slide.order_index, slide.is_active]
    );
    
    connection.release();
    res.status(201).json({ id: (result as any).insertId, ...slide });
  } catch (error) {
    console.error('Erreur lors de la création du slide:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const updateSlide = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const slide: Slide = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      `UPDATE slides SET title = ?, subtitle = ?, cta_text = ?, cta_link = ?, 
       image_url = ?, alt_text = ?, order_index = ?, is_active = ? WHERE id = ?`,
      [slide.title, slide.subtitle, slide.cta_text, slide.cta_link, slide.image_url, slide.alt_text, slide.order_index, slide.is_active, id]
    );
    
    connection.release();
    res.json({ id: parseInt(id), ...slide });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du slide:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const deleteSlide = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    await connection.execute('DELETE FROM slides WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Slide supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du slide:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// API Blog
export const getBlogs = async (req: any, res: any) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM blogs ORDER BY created_at DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const getBlogById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM blogs WHERE id = ?', [id]);
    connection.release();
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    
    res.json((rows as any[])[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const createBlog = async (req: any, res: any) => {
  try {
    const blog: Blog = req.body;
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO blogs (title, slug, content, excerpt, image_url, author, status, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [blog.title, blog.slug, blog.content, blog.excerpt, blog.image_url, blog.author, blog.status, blog.meta_title, blog.meta_description]
    );
    
    connection.release();
    res.status(201).json({ id: (result as any).insertId, ...blog });
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const updateBlog = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const blog: Blog = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      `UPDATE blogs SET title = ?, slug = ?, content = ?, excerpt = ?, image_url = ?, 
       author = ?, status = ?, meta_title = ?, meta_description = ? WHERE id = ?`,
      [blog.title, blog.slug, blog.content, blog.excerpt, blog.image_url, blog.author, blog.status, blog.meta_title, blog.meta_description, id]
    );
    
    connection.release();
    res.json({ id: parseInt(id), ...blog });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const deleteBlog = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    await connection.execute('DELETE FROM blogs WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// API Features
export const getFeatures = async (req: any, res: any) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM features ORDER BY order_index ASC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des fonctionnalités:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const createFeature = async (req: any, res: any) => {
  try {
    const feature: Feature = req.body;
    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO features (title, description, icon, icon_url, order_index, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [feature.title, feature.description, feature.icon, feature.icon_url, feature.order_index, feature.is_active]
    );
    
    connection.release();
    res.status(201).json({ id: (result as any).insertId, ...feature });
  } catch (error) {
    console.error('Erreur lors de la création de la fonctionnalité:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const updateFeature = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const feature: Feature = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      `UPDATE features SET title = ?, description = ?, icon = ?, icon_url = ?, order_index = ?, is_active = ? WHERE id = ?`,
      [feature.title, feature.description, feature.icon, feature.icon_url, feature.order_index, feature.is_active, id]
    );
    
    connection.release();
    res.json({ id: parseInt(id), ...feature });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la fonctionnalité:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const deleteFeature = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    await connection.execute('DELETE FROM features WHERE id = ?', [id]);
    connection.release();
    
    res.json({ message: 'Fonctionnalité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la fonctionnalité:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// API Dashboard
export const getDashboardStats = async (req: any, res: any) => {
  try {
    const connection = await pool.getConnection();
    
    const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const [slideCount] = await connection.execute('SELECT COUNT(*) as count FROM slides WHERE is_active = TRUE');
    const [blogCount] = await connection.execute('SELECT COUNT(*) as count FROM blogs WHERE status = "published"');
    const [featureCount] = await connection.execute('SELECT COUNT(*) as count FROM features WHERE is_active = TRUE');
    
    connection.release();
    
    res.json({
      products: (productCount as any[])[0].count,
      slides: (slideCount as any[])[0].count,
      blogs: (blogCount as any[])[0].count,
      features: (featureCount as any[])[0].count
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};