import mysql from 'mysql2/promise';

const dbConfig = {
  host: '185.183.35.80',
  port: 3307,
  user: 'root',
  password: 'StrongPass123',
  database: 'sp_base',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Créer le pool de connexions
export const pool = mysql.createPool(dbConfig);

// Fonction pour tester la connexion
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données MySQL réussie');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    return false;
  }
};

// Fonction pour initialiser les tables
export const initializeTables = async () => {
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
        slug VARCHAR(255) UNIQUE NOT NULL,
        reference VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(150),
        short_description TEXT,
        long_description TEXT,
        image_url VARCHAR(500),
        images JSON,
        specifications JSON,
        benefits JSON,
        downloads JSON,
        compatibility JSON,
        related_products JSON,
        is_active BOOLEAN DEFAULT TRUE,
        is_new BOOLEAN DEFAULT FALSE,
        featured BOOLEAN DEFAULT FALSE,
        meta_title VARCHAR(255),
        meta_description TEXT,
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
        alt_text VARCHAR(255),
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
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
        excerpt TEXT,
        image_url VARCHAR(500),
        author VARCHAR(100) DEFAULT 'SpiderHome',
        status ENUM('draft', 'published') DEFAULT 'draft',
        meta_title VARCHAR(255),
        meta_description TEXT,
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
        icon VARCHAR(100),
        icon_url VARCHAR(500),
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Table login_attempts (pour la protection brute-force)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        username VARCHAR(50),
        success BOOLEAN DEFAULT FALSE,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip_time (ip_address, attempted_at),
        INDEX idx_username_time (username, attempted_at)
      )
    `);

    // Table specifications (spécifications techniques des produits)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS specifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        paramètre VARCHAR(255) NOT NULL,
        valeur VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id)
      )
    `);

    // Table downloads (téléchargements des produits)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        type VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id)
      )
    `);

    // Table related_products (produits associés)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS related_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        related_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (related_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id),
        INDEX idx_related_id (related_id),
        UNIQUE KEY unique_relation (product_id, related_id)
      )
    `);

    // Table categories (nom + sous-catégories JSON)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) UNIQUE NOT NULL,
        subcategories JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Assurer la présence de la colonne subcategory dans products (si base existante)
    try {
      const [colCheck] = await connection.execute("SHOW COLUMNS FROM products LIKE 'subcategory'");
      if ((colCheck as any[]).length === 0) {
        await connection.execute('ALTER TABLE products ADD COLUMN subcategory VARCHAR(150) NULL');
      }
    } catch (e) {
      console.warn('Impossible de vérifier/ajouter la colonne subcategory:', e);
    }

    // Assurer la présence de la colonne is_active (visibilité publique)
    try {
      const [colCheck2] = await connection.execute("SHOW COLUMNS FROM products LIKE 'is_active'");
      if ((colCheck2 as any[]).length === 0) {
        await connection.execute('ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
      }
    } catch (e) {
      console.warn('Impossible de vérifier/ajouter la colonne is_active:', e);
    }

    connection.release();
    console.log('✅ Tables de base de données initialisées avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des tables:', error);
    return false;
  }
};

// Fonction pour créer l'utilisateur admin par défaut
export const createDefaultAdmin = async () => {
  try {
    const bcrypt = await import('bcryptjs');
    const connection = await pool.getConnection();
    
    // Vérifier si l'admin existe déjà
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin_spiderhome']
    );
    
    if ((existingAdmin as any[]).length === 0) {
      // Créer l'admin par défaut
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
};

export default pool;