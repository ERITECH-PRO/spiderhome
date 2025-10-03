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
        const { page = 1, limit = 20, category, is_new } = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const offset = (pageNum - 1) * pageSize;
        const filters = [];
        const params = [];
        if (category) {
            filters.push('category = ?');
            params.push(category);
        }
        if (is_new !== undefined) {
            filters.push('is_new = ?');
            params.push(is_new === '1' || is_new === 'true');
        }
        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const connection = await pool.getConnection();
        // Vérifier si la table products existe
        const [tableCheck] = await connection.execute("SHOW TABLES LIKE 'products'");
        if (tableCheck.length === 0) {
            connection.release();
            return res.json({
                data: [],
                pagination: {
                    page: pageNum,
                    limit: pageSize,
                    total: 0,
                    pages: 0
                }
            });
        }
        const limitNum = Number.isFinite(pageSize) ? Math.trunc(pageSize) : 20;
        const offsetNum = Number.isFinite(offset) ? Math.trunc(offset) : 0;
        const listQuery = `SELECT id, title, slug, reference, category, short_description, image_url, images, is_new, featured, is_active
       FROM products ${whereClause}
       ORDER BY created_at DESC
       LIMIT ${limitNum} OFFSET ${offsetNum}`;
        const [rows] = await connection.execute(listQuery, params);
        const [countRows] = await connection.execute(`SELECT COUNT(*) as total FROM products ${whereClause}`, params);
        // Normalize images and provide fallback image_url from images JSON
        const normalizedRows = rows.map((p) => {
            let images = [];
            try {
                images = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
            }
            catch {
                images = [];
            }
            const firstWithUrl = Array.isArray(images) ? images.find((img) => img && img.url) : null;
            const image_url = p.image_url || (firstWithUrl ? firstWithUrl.url : null);
            return { ...p, images, image_url };
        });
        connection.release();
        res.json({
            data: normalizedRows,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total: countRows[0].total,
                pages: Math.ceil(countRows[0].total / pageSize)
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
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
// Produit par slug (public)
export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM products WHERE slug = ? AND is_active = 1 LIMIT 1', [slug]);
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const product = rows[0];
        // Parser les champs JSON si nécessaire
        const parseIfString = (v) => {
            if (typeof v === 'string') {
                try {
                    return JSON.parse(v);
                }
                catch {
                    return v;
                }
            }
            return v;
        };
        product.images = parseIfString(product.images) || [];
        product.specifications = parseIfString(product.specifications) || [];
        product.benefits = parseIfString(product.benefits) || [];
        product.downloads = parseIfString(product.downloads) || [];
        product.compatibility = parseIfString(product.compatibility) || [];
        product.related_products = parseIfString(product.related_products) || [];
        res.json(product);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du produit par slug:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// Recherche de produits
export const searchProducts = async (req, res) => {
    try {
        const { q = '' } = req.query;
        const term = `%${String(q).trim()}%`;
        const connection = await pool.getConnection();
        // Vérifier si la table products existe
        const [tableCheck] = await connection.execute("SHOW TABLES LIKE 'products'");
        if (tableCheck.length === 0) {
            connection.release();
            return res.json([]);
        }
        const [rows] = await connection.execute(`SELECT id, title, slug, reference, category, short_description, image_url, is_new, featured
       FROM products
       WHERE title LIKE ? OR reference LIKE ? OR category LIKE ?
       ORDER BY created_at DESC
       LIMIT 50`, [term, term, term]);
        connection.release();
        res.json(rows);
    }
    catch (error) {
        console.error('Erreur lors de la recherche de produits:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// API Publique pour les produits
export const getProductsPublic = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        // Vérifier si la table products existe
        const [tableCheck] = await connection.execute("SHOW TABLES LIKE 'products'");
        if (tableCheck.length === 0) {
            connection.release();
            return res.json({
                data: [],
                pagination: {
                    totalProducts: 0,
                    totalPages: 0,
                    currentPage: 1,
                    limit: 12
                }
            });
        }
        const whereParts = ['is_active = 1'];
        const queryParams = [];
        // Filtering
        const { category, is_new, search } = req.query;
        if (category) {
            whereParts.push('category = ?');
            queryParams.push(category);
        }
        if (is_new === '1' || is_new === 'true') {
            whereParts.push('is_new = 1');
        }
        if (search) {
            whereParts.push('(title LIKE ? OR reference LIKE ? OR category LIKE ? OR short_description LIKE ?)');
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        const whereClause = `WHERE ${whereParts.join(' AND ')}`;
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        // Count total products
        const [totalRows] = await connection.execute(`SELECT COUNT(*) as count FROM products ${whereClause}`, queryParams);
        const totalProducts = totalRows[0].count;
        const totalPages = Math.ceil(totalProducts / limit);
        const listQuery = `SELECT id, title, slug, reference, category, short_description, image_url, images, is_new, featured FROM products ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        const [rows] = await connection.execute(listQuery, queryParams);
        // Normalize image_url with first images[].url when empty
        const normalizedRows = rows.map((p) => {
            let imagesArr = [];
            try {
                imagesArr = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
            }
            catch {
                imagesArr = [];
            }
            const firstWithUrl = Array.isArray(imagesArr) ? imagesArr.find((img) => img && img.url) : null;
            const image_url = p.image_url || (firstWithUrl ? firstWithUrl.url : null);
            return { ...p, images: imagesArr, image_url };
        });
        connection.release();
        res.json({
            data: normalizedRows,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: page,
                limit
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
    }
};
export const getProductBySlugPublic = async (req, res) => {
    try {
        const { slug } = req.params;
        const connection = await pool.getConnection();
        // Vérifier si la table products existe
        const [tableCheck] = await connection.execute("SHOW TABLES LIKE 'products'");
        if (tableCheck.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const [productRows] = await connection.execute('SELECT * FROM products WHERE slug = ?', [slug]);
        if (productRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const product = productRows[0];
        // Parse JSON fields
        const parseJsonField = (field) => {
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                }
                catch (e) {
                    return [];
                }
            }
            return field || [];
        };
        const images = parseJsonField(product.images);
        const specifications = parseJsonField(product.specifications);
        const benefits = parseJsonField(product.benefits);
        const downloads = parseJsonField(product.downloads);
        const compatibility = parseJsonField(product.compatibility);
        const related_products_ids = parseJsonField(product.related_products);
        let relatedProductsData = [];
        if (Array.isArray(related_products_ids) && related_products_ids.length > 0) {
            const [relatedRows] = await connection.execute(`SELECT id, title, slug, reference, image_url, short_description FROM products WHERE id IN (${related_products_ids.map(() => '?').join(',')})`, related_products_ids);
            relatedProductsData = relatedRows;
        }
        connection.release();
        const completeProduct = {
            ...product,
            images,
            specifications,
            benefits,
            downloads,
            compatibility,
            related_products: relatedProductsData
        };
        res.json(completeProduct);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du produit par slug:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const searchProductsPublic = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Paramètre de recherche "q" manquant' });
        }
        const connection = await pool.getConnection();
        // Vérifier si la table products existe
        const [tableCheck] = await connection.execute("SHOW TABLES LIKE 'products'");
        if (tableCheck.length === 0) {
            connection.release();
            return res.json([]);
        }
        const searchTerm = `%${q}%`;
        const [rows] = await connection.execute(`SELECT id, title, slug, reference, category, short_description, image_url, is_new, featured
       FROM products
       WHERE is_active = 1 AND (title LIKE ? OR reference LIKE ? OR category LIKE ? OR short_description LIKE ?)
       ORDER BY created_at DESC`, [searchTerm, searchTerm, searchTerm, searchTerm]);
        connection.release();
        res.json(rows);
    }
    catch (error) {
        console.error('Erreur lors de la recherche de produits:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const getRelatedProductsPublic = async (req, res) => {
    try {
        const { slug } = req.params;
        const connection = await pool.getConnection();
        // Vérifier si la table products existe
        const [tableCheck] = await connection.execute("SHOW TABLES LIKE 'products'");
        if (tableCheck.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const [productRows] = await connection.execute('SELECT related_products FROM products WHERE slug = ?', [slug]);
        if (productRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const product = productRows[0];
        const related_products_ids = JSON.parse(product.related_products || '[]');
        let relatedProductsData = [];
        if (Array.isArray(related_products_ids) && related_products_ids.length > 0) {
            const [relatedRows] = await connection.execute(`SELECT id, title, slug, reference, image_url, short_description FROM products WHERE id IN (${related_products_ids.map(() => '?').join(',')})`, related_products_ids);
            relatedProductsData = relatedRows;
        }
        connection.release();
        res.json(relatedProductsData);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits associés:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// Produits associés par slug
export const getRelatedBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const connection = await pool.getConnection();
        const [prodRows] = await connection.execute('SELECT id, related_products FROM products WHERE slug = ? LIMIT 1', [slug]);
        if (prodRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const product = prodRows[0];
        let relatedIds = [];
        if (product.related_products) {
            try {
                relatedIds = typeof product.related_products === 'string' ? JSON.parse(product.related_products) : product.related_products;
            }
            catch {
                relatedIds = [];
            }
        }
        if (!Array.isArray(relatedIds) || relatedIds.length === 0) {
            connection.release();
            return res.json([]);
        }
        const placeholders = relatedIds.map(() => '?').join(',');
        const [rows] = await connection.execute(`SELECT id, title, slug, reference, category, short_description, image_url, is_new, featured
       FROM products WHERE id IN (${placeholders})`, relatedIds);
        connection.release();
        res.json(rows);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits associés:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
// Nouvelle fonction pour récupérer un produit complet avec toutes ses données
export const getProductComplete = async (req, res) => {
    try {
        const { slug } = req.params;
        const connection = await pool.getConnection();
        // Récupérer le produit principal
        const [productRows] = await connection.execute('SELECT * FROM products WHERE slug = ?', [slug]);
        if (productRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        const product = productRows[0];
        const productId = product.id;
        let specifications = [];
        let downloads = [];
        let relatedProducts = [];
        try {
            // Récupérer les spécifications depuis la table dédiée
            const [specRows] = await connection.execute('SELECT paramètre, valeur FROM specifications WHERE product_id = ? ORDER BY id', [productId]);
            specifications = specRows.map(spec => ({
                label: spec.paramètre,
                value: spec.valeur
            }));
        }
        catch (specError) {
            console.log('Table specifications non disponible, utilisation des données JSON');
            // Fallback vers les données JSON dans la table products
            if (product.specifications && typeof product.specifications === 'string') {
                try {
                    specifications = JSON.parse(product.specifications);
                }
                catch (parseError) {
                    specifications = [];
                }
            }
            else if (Array.isArray(product.specifications)) {
                specifications = product.specifications;
            }
        }
        try {
            // Récupérer les téléchargements depuis la table dédiée
            const [downloadRows] = await connection.execute('SELECT type, url FROM downloads WHERE product_id = ? ORDER BY id', [productId]);
            downloads = downloadRows.map(download => ({
                name: download.type,
                type: 'PDF',
                url: download.url,
                size: 'N/A'
            }));
        }
        catch (downloadError) {
            console.log('Table downloads non disponible, utilisation des données JSON');
            // Fallback vers les données JSON dans la table products
            if (product.downloads && typeof product.downloads === 'string') {
                try {
                    downloads = JSON.parse(product.downloads);
                }
                catch (parseError) {
                    downloads = [];
                }
            }
            else if (Array.isArray(product.downloads)) {
                downloads = product.downloads;
            }
        }
        try {
            // Récupérer les produits associés depuis la table dédiée
            const [relatedRows] = await connection.execute(`SELECT p.id, p.title, p.slug, p.reference, p.image_url, p.short_description 
         FROM related_products rp 
         JOIN products p ON rp.related_id = p.id 
         WHERE rp.product_id = ? 
         ORDER BY rp.id`, [productId]);
            relatedProducts = relatedRows;
        }
        catch (relatedError) {
            console.log('Table related_products non disponible, utilisation des données JSON');
            // Fallback vers les données JSON dans la table products
            if (product.related_products && typeof product.related_products === 'string') {
                try {
                    const relatedIds = JSON.parse(product.related_products);
                    if (Array.isArray(relatedIds) && relatedIds.length > 0) {
                        const [relatedRows] = await connection.execute(`SELECT id, title, slug, reference, image_url, short_description 
               FROM products 
               WHERE id IN (${relatedIds.map(() => '?').join(',')})`, relatedIds);
                        relatedProducts = relatedRows;
                    }
                }
                catch (parseError) {
                    relatedProducts = [];
                }
            }
            else if (Array.isArray(product.related_products)) {
                relatedProducts = product.related_products;
            }
        }
        connection.release();
        // Construire la réponse complète
        const completeProduct = {
            ...product,
            specifications,
            downloads,
            related_products: relatedProducts
        };
        res.json(completeProduct);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du produit complet:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
export const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const connection = await pool.getConnection();
        // Ensure all values are properly defined (not undefined)
        let safeProduct = {
            title: product.title || '',
            slug: product.slug || '',
            reference: product.reference || '',
            category: product.category || '',
            subcategory: product.subcategory || null,
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
            is_active: product.is_active !== undefined ? !!product.is_active : true,
            meta_title: product.meta_title || null,
            meta_description: product.meta_description || null
        };
        // Ensure unique slug
        let finalSlug = safeProduct.slug;
        let counter = 1;
        while (true) {
            const [existing] = await connection.execute('SELECT id FROM products WHERE slug = ?', [finalSlug]);
            if (existing.length === 0) {
                break; // Slug is unique
            }
            // Add counter to make slug unique
            finalSlug = `${safeProduct.slug}-${counter}`;
            counter++;
        }
        safeProduct.slug = finalSlug;
        const [result] = await connection.execute(`INSERT INTO products (title, slug, reference, category, subcategory, short_description, long_description, 
       image_url, images, specifications, benefits, downloads, compatibility, related_products, 
       is_new, featured, is_active, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            safeProduct.title, safeProduct.slug, safeProduct.reference, safeProduct.category, safeProduct.subcategory,
            safeProduct.short_description, safeProduct.long_description, safeProduct.image_url,
            JSON.stringify(safeProduct.images), JSON.stringify(safeProduct.specifications),
            JSON.stringify(safeProduct.benefits), JSON.stringify(safeProduct.downloads),
            JSON.stringify(safeProduct.compatibility), JSON.stringify(safeProduct.related_products),
            safeProduct.is_new, safeProduct.featured, safeProduct.is_active, safeProduct.meta_title, safeProduct.meta_description
        ]);
        connection.release();
        res.status(201).json({ id: result.insertId, ...safeProduct });
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
        // Ensure all values are properly defined (not undefined)
        let safeProduct = {
            title: product.title || '',
            slug: product.slug || '',
            reference: product.reference || '',
            category: product.category || '',
            subcategory: product.subcategory || null,
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
            is_active: product.is_active !== undefined ? !!product.is_active : true,
            meta_title: product.meta_title || null,
            meta_description: product.meta_description || null
        };
        // Ensure unique slug (check if slug is different and unique)
        const [currentProduct] = await connection.execute('SELECT slug FROM products WHERE id = ?', [id]);
        const currentSlug = currentProduct[0]?.slug;
        if (safeProduct.slug !== currentSlug) {
            let finalSlug = safeProduct.slug;
            let counter = 1;
            while (true) {
                const [existing] = await connection.execute('SELECT id FROM products WHERE slug = ? AND id != ?', [finalSlug, id]);
                if (existing.length === 0) {
                    break; // Slug is unique
                }
                // Add counter to make slug unique
                finalSlug = `${safeProduct.slug}-${counter}`;
                counter++;
            }
            safeProduct.slug = finalSlug;
        }
        await connection.execute(`UPDATE products SET title = ?, slug = ?, reference = ?, category = ?, subcategory = ?, 
       short_description = ?, long_description = ?, image_url = ?, images = ?, 
       specifications = ?, benefits = ?, downloads = ?, compatibility = ?, related_products = ?, 
       is_new = ?, featured = ?, is_active = ?, meta_title = ?, meta_description = ? 
       WHERE id = ?`, [
            safeProduct.title, safeProduct.slug, safeProduct.reference, safeProduct.category, safeProduct.subcategory,
            safeProduct.short_description, safeProduct.long_description, safeProduct.image_url,
            JSON.stringify(safeProduct.images), JSON.stringify(safeProduct.specifications),
            JSON.stringify(safeProduct.benefits), JSON.stringify(safeProduct.downloads),
            JSON.stringify(safeProduct.compatibility), JSON.stringify(safeProduct.related_products),
            safeProduct.is_new, safeProduct.featured, safeProduct.is_active, safeProduct.meta_title, safeProduct.meta_description, id
        ]);
        connection.release();
        res.json({ id: parseInt(id), ...safeProduct });
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
// Mettre à jour uniquement la visibilité publique (is_active)
export const updateProductVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body || {};
        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ error: 'Champ is_active manquant ou invalide' });
        }
        const connection = await pool.getConnection();
        await connection.execute('UPDATE products SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
        connection.release();
        res.json({ id: parseInt(id, 10), is_active });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la visibilité:', error);
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
export const getSlideById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM slides WHERE id = ?', [id]);
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Slide non trouvé' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du slide:', error);
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
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM blogs WHERE id = ?', [id]);
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Article non trouvé' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
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
