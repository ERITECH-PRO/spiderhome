#!/bin/bash

echo "🚀 Déploiement de SpiderHome en production..."

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -f docker-compose.simple.yml down

# Nettoyer les images non utilisées
echo "🧹 Nettoyage des images..."
docker system prune -f

# Construire et démarrer les nouveaux conteneurs
echo "🔨 Construction et démarrage des conteneurs..."
docker-compose -f docker-compose.simple.yml up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier l'état des conteneurs
echo "📊 État des conteneurs:"
docker-compose -f docker-compose.simple.yml ps

# Tester les endpoints
echo "🔍 Test des endpoints..."
echo "Backend health:"
curl -s http://185.183.35.80:3003/health | head -1

echo "Frontend health:"
curl -s http://185.183.35.80:5175/health | head -1

echo "✅ Déploiement terminé !"
echo "🌐 Site: http://185.183.35.80:5175"
echo "🔐 Admin: http://185.183.35.80:5175/admin"
echo "🏥 Health: http://185.183.35.80:3003/health"
