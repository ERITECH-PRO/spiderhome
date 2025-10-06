// Configuration de l'application
export const config = {
  // URL du serveur backend
  serverUrl:
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SERVER_URL || import.meta.env?.VITE_PROXY_TARGET))
    || process.env.VITE_SERVER_URL
    || process.env.VITE_PROXY_TARGET
    || 'http://185.183.35.80:3003',
  
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
export const getServerUrl = (path: string = '') => {
  const baseUrl = config.serverUrl.endsWith('/') 
    ? config.serverUrl.slice(0, -1) 
    : config.serverUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Fonction utilitaire pour l'URL des images
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/LOGO SPIDERHOME SANS FONT@1080x.png';
  // Already absolute URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Si c'est une URL absolue pointant vers /uploads, renvoyer un chemin relatif pour éviter le mixed content
    try {
      const url = new URL(imagePath);
      if (url.pathname.startsWith('/uploads/')) {
        return url.pathname; // laisser Nginx proxyer /uploads vers le backend
      }
    } catch {}
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
    } else if (/^uploads\//i.test(normalized)) {
      normalized = '/' + normalized;
    } else if (!normalized.startsWith('/')) {
      // Treat as bare filename
      normalized = `/uploads/${normalized}`;
    }
  }

  // Pour éviter le mixed content, retourner un chemin relatif sous /uploads
  return normalized;
};
