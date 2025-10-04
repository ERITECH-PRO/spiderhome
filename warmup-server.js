import fetch from 'node-fetch';

const BASE_URL = process.env.SERVER_URL || 'http://185.183.35.80:3003';

async function warmupServer() {
  console.log('🔥 Démarrage du warm-up du serveur...');
  
  const endpoints = [
    '/health',
    '/api/products/homepage',
    '/api/slides',
    '/api/features',
    '/api/products?limit=6',
    '/api/categories'
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔄 Test de ${endpoint}...`);
      const start = Date.now();
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'SpiderHome-Warmup/1.0'
        }
      });
      
      const duration = Date.now() - start;
      const status = response.status;
      
      if (response.ok) {
        console.log(`✅ ${endpoint} - ${status} (${duration}ms)`);
        results.push({ endpoint, status, duration, success: true });
      } else {
        console.log(`⚠️ ${endpoint} - ${status} (${duration}ms)`);
        results.push({ endpoint, status, duration, success: false });
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Erreur: ${error.message}`);
      results.push({ endpoint, status: 0, duration: 0, success: false, error: error.message });
    }
  }
  
  // Statistiques
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  const avgDuration = results
    .filter(r => r.success && r.duration > 0)
    .reduce((sum, r) => sum + r.duration, 0) / successful;
  
  console.log('\n📊 Résultats du warm-up:');
  console.log(`✅ Succès: ${successful}/${total}`);
  console.log(`⏱️ Temps moyen: ${Math.round(avgDuration)}ms`);
  
  if (successful === total) {
    console.log('🎉 Warm-up réussi ! Le serveur est prêt.');
  } else {
    console.log('⚠️ Certains endpoints ont échoué. Vérifiez les logs.');
  }
  
  return results;
}

// Exécuter le warm-up si ce script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  warmupServer().catch(console.error);
}

export default warmupServer;
