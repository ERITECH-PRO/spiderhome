import { pool } from '../config/database.js';
import { verifyToken } from '../utils/auth.js';
// Middleware pour vérifier l'authentification
export const requireAuth = (req, res, next) => {
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
export const getProducts = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
        connection.release();
        res.json(rows);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`INSERT INTO products (title, slug, reference, category, short_description, long_description, 
       image_url, specifications, benefits, downloads, compatibility, related_products, 
       is_new, featured, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            product.title, product.slug, product.reference, product.category,
            product.short_description, product.long_description, product.image_url,
            JSON.stringify(product.specifications), JSON.stringify(product.benefits),
            JSON.stringify(product.downloads), JSON.stringify(product.compatibility),
            JSON.stringify(product.related_products), product.is_new, product.featured,
            product.meta_title, product.meta_description
        ]);
        connection.release();
        res.status(201).json({ id: result.insertId, ...product });
    }
    catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;
        const connection = await pool.getConnection();
        await connection.execute(`UPDATE products SET title = ?, slug = ?, reference = ?, category = ?, 
       short_description = ?, long_description = ?, image_url = ?, specifications = ?, 
       benefits = ?, downloads = ?, compatibility = ?, related_products = ?, 
       is_new = ?, featured = ?, meta_title = ?, meta_description = ? 
       WHERE id = ?`, [
            product.title, product.slug, product.reference, product.category,
            product.short_description, product.long_description, product.image_url,
            JSON.stringify(product.specifications), JSON.stringify(product.benefits),
            JSON.stringify(product.downloads), JSON.stringify(product.compatibility),
            JSON.stringify(product.related_products), product.is_new, product.featured,
            product.meta_title, product.meta_description, id
        ]);
        connection.release();
        res.json({ id: parseInt(id), ...product });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM products WHERE id = ?', [id]);
        connection.release();
        res.json({ message: 'Produit supprimé avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// API Slides
export const getSlides = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM slides ORDER BY order_index ASC');
        connection.release();
        res.json(rows);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des slides:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const createSlide = async (req, res) => {
    try {
        const slide = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`INSERT INTO slides (title, subtitle, cta_text, cta_link, image_url, alt_text, order_index, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [slide.title, slide.subtitle, slide.cta_text, slide.cta_link, slide.image_url, slide.alt_text, slide.order_index, slide.is_active]);
        connection.release();
        res.status(201).json({ id: result.insertId, ...slide });
    }
    catch (error) {
        console.error('Erreur lors de la création du slide:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const slide = req.body;
        const connection = await pool.getConnection();
        await connection.execute(`UPDATE slides SET title = ?, subtitle = ?, cta_text = ?, cta_link = ?, 
       image_url = ?, alt_text = ?, order_index = ?, is_active = ? WHERE id = ?`, [slide.title, slide.subtitle, slide.cta_text, slide.cta_link, slide.image_url, slide.alt_text, slide.order_index, slide.is_active, id]);
        connection.release();
        res.json({ id: parseInt(id), ...slide });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du slide:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM slides WHERE id = ?', [id]);
        connection.release();
        res.json({ message: 'Slide supprimé avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du slide:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// API Blog
export const getBlogs = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM blogs ORDER BY created_at DESC');
        connection.release();
        res.json(rows);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const createBlog = async (req, res) => {
    try {
        const blog = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`INSERT INTO blogs (title, slug, content, excerpt, image_url, author, status, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [blog.title, blog.slug, blog.content, blog.excerpt, blog.image_url, blog.author, blog.status, blog.meta_title, blog.meta_description]);
        connection.release();
        res.status(201).json({ id: result.insertId, ...blog });
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'article:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = req.body;
        const connection = await pool.getConnection();
        await connection.execute(`UPDATE blogs SET title = ?, slug = ?, content = ?, excerpt = ?, image_url = ?, 
       author = ?, status = ?, meta_title = ?, meta_description = ? WHERE id = ?`, [blog.title, blog.slug, blog.content, blog.excerpt, blog.image_url, blog.author, blog.status, blog.meta_title, blog.meta_description, id]);
        connection.release();
        res.json({ id: parseInt(id), ...blog });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de l\'article:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM blogs WHERE id = ?', [id]);
        connection.release();
        res.json({ message: 'Article supprimé avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// API Features
export const getFeatures = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM features ORDER BY order_index ASC');
        connection.release();
        res.json(rows);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des fonctionnalités:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const createFeature = async (req, res) => {
    try {
        const feature = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`INSERT INTO features (title, description, icon, icon_url, order_index, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`, [feature.title, feature.description, feature.icon, feature.icon_url, feature.order_index, feature.is_active]);
        connection.release();
        res.status(201).json({ id: result.insertId, ...feature });
    }
    catch (error) {
        console.error('Erreur lors de la création de la fonctionnalité:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const updateFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const feature = req.body;
        const connection = await pool.getConnection();
        await connection.execute(`UPDATE features SET title = ?, description = ?, icon = ?, icon_url = ?, order_index = ?, is_active = ? WHERE id = ?`, [feature.title, feature.description, feature.icon, feature.icon_url, feature.order_index, feature.is_active, id]);
        connection.release();
        res.json({ id: parseInt(id), ...feature });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la fonctionnalité:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const deleteFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM features WHERE id = ?', [id]);
        connection.release();
        res.json({ message: 'Fonctionnalité supprimée avec succès' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la fonctionnalité:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// API Dashboard
export const getDashboardStats = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
        const [slideCount] = await connection.execute('SELECT COUNT(*) as count FROM slides WHERE is_active = TRUE');
        const [blogCount] = await connection.execute('SELECT COUNT(*) as count FROM blogs WHERE status = "published"');
        const [featureCount] = await connection.execute('SELECT COUNT(*) as count FROM features WHERE is_active = TRUE');
        connection.release();
        res.json({
            products: productCount[0].count,
            slides: slideCount[0].count,
            blogs: blogCount[0].count,
            features: featureCount[0].count
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
//# sourceMappingURL=admin.js.map