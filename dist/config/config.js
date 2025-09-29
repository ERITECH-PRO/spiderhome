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
    if (imagePath.startsWith('http'))
        return imagePath;
    return getServerUrl(imagePath);
};
//# sourceMappingURL=config.js.map