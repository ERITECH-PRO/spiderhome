// Configuration de l'application
export const config = {
    // URL du serveur backend
    serverUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SERVER_URL) || process.env.VITE_SERVER_URL || 'http://localhost:3002',
    // Configuration de l'application
    appName: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_NAME) || process.env.VITE_APP_NAME || 'SpiderHome',
    appVersion: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_VERSION) || process.env.VITE_APP_VERSION || '1.0.0',
    // Configuration des uploads
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    // Configuration de l'API
    apiTimeout: 10000, // 10 secondes
};
// Fonction utilitaire pour construire l'URL complète
export const getServerUrl = (path = '') => {
    const baseUrl = config.serverUrl.endsWith('/')
        ? config.serverUrl.slice(0, -1)
        : config.serverUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};
// Fonction utilitaire pour l'URL des images
export const getImageUrl = (imagePath) => {
    if (!imagePath)
        return '/placeholder-product.jpg';
    // Already absolute URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Normalize common stored variants to the public '/uploads/' mount
    let normalized = imagePath.trim();
    // Handle Windows backslashes from server-side joins
    normalized = normalized.replace(/\\/g, '/');
    // Strip known prefixes and map to served path
    normalized = normalized
        .replace(/^\/?public\//i, '/')
        .replace(/^\/?dist\//i, '/')
        .replace(/^\/?static\//i, '/')
        .replace(/^\/?assets\//i, '/')
        .replace(/^\/?images?\//i, '/');
    // Ensure it points under '/uploads/' when a filename or wrong folder is provided
    if (!normalized.startsWith('/uploads/')) {
        // If the path already contains '/uploads' without leading slash
        const uploadsIdx = normalized.toLowerCase().indexOf('/uploads/');
        if (uploadsIdx !== -1) {
            normalized = normalized.substring(uploadsIdx);
        }
        else if (/^uploads\//i.test(normalized)) {
            normalized = '/' + normalized;
        }
        else if (!normalized.startsWith('/')) {
            // Treat as bare filename
            normalized = `/uploads/${normalized}`;
        }
    }
    return getServerUrl(normalized);
};
