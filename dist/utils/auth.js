import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
const JWT_SECRET = process.env.JWT_SECRET || 'spiderhome_secret_key_2024';
const JWT_EXPIRES_IN = '24h';
// Fonction pour enregistrer une tentative de connexion
export const logLoginAttempt = async (attempt) => {
    try {
        const connection = await pool.getConnection();
        await connection.execute('INSERT INTO login_attempts (ip_address, username, success) VALUES (?, ?, ?)', [attempt.ip, attempt.username || null, attempt.success]);
        connection.release();
    }
    catch (error) {
        console.error('Erreur lors de l\'enregistrement de la tentative de connexion:', error);
    }
};
// Fonction pour vérifier les tentatives de connexion (protection brute-force)
export const checkBruteForce = async (ip, username) => {
    try {
        const connection = await pool.getConnection();
        // Vérifier les tentatives échouées dans les 15 dernières minutes
        const [failedAttempts] = await connection.execute(`SELECT COUNT(*) as count FROM login_attempts 
       WHERE ip_address = ? AND success = FALSE 
       AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)`, [ip]);
        // Vérifier les tentatives échouées pour ce nom d'utilisateur dans les 15 dernières minutes
        let userFailedAttempts = 0;
        if (username) {
            const [userAttempts] = await connection.execute(`SELECT COUNT(*) as count FROM login_attempts 
         WHERE username = ? AND success = FALSE 
         AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)`, [username]);
            userFailedAttempts = userAttempts[0].count;
        }
        connection.release();
        // Limite: 5 tentatives par IP ou 3 par utilisateur
        return failedAttempts[0].count >= 5 || userFailedAttempts >= 3;
    }
    catch (error) {
        console.error('Erreur lors de la vérification brute-force:', error);
        return false;
    }
};
// Fonction d'authentification
export const authenticateUser = async (username, password, ip) => {
    try {
        // Vérifier la protection brute-force
        const isBlocked = await checkBruteForce(ip, username);
        if (isBlocked) {
            await logLoginAttempt({ ip, username, success: false, timestamp: new Date() });
            return {
                success: false,
                message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
            };
        }
        const connection = await pool.getConnection();
        // Récupérer l'utilisateur
        const [users] = await connection.execute('SELECT id, username, password_hash, role FROM users WHERE username = ?', [username]);
        connection.release();
        if (users.length === 0) {
            await logLoginAttempt({ ip, username, success: false, timestamp: new Date() });
            return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
        }
        const user = users[0];
        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            await logLoginAttempt({ ip, username, success: false, timestamp: new Date() });
            return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
        }
        // Connexion réussie
        await logLoginAttempt({ ip, username, success: true, timestamp: new Date() });
        // Générer le token JWT
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        await logLoginAttempt({ ip, username, success: false, timestamp: new Date() });
        return { success: false, message: 'Erreur interne du serveur' };
    }
};
// Fonction pour vérifier le token JWT
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            valid: true,
            user: {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role
            }
        };
    }
    catch (error) {
        return {
            valid: false,
            message: 'Token invalide ou expiré'
        };
    }
};
// Fonction pour obtenir l'IP du client
export const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        '127.0.0.1';
};
