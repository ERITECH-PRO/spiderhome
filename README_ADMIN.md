# SpiderHome - Espace Administrateur

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ (recommandé 20+)
- Accès à la base de données MySQL distante

### Installation
```bash
npm install
```

### Démarrage en développement
```bash
# Démarrer le frontend et le backend ensemble
npm run dev:full
```

### Démarrage en production
```bash
# Build complet et démarrage
npm start
```

## 🔐 Accès Administration

**URL :** `http://localhost:3001/admin`

**Identifiants :**
- **Utilisateur :** `admin_spiderhome`
- **Mot de passe :** `Industrial2024`

## 🗄️ Base de données

La base de données MySQL distante est automatiquement configurée avec :
- **Host :** 185.183.35.80:3307
- **Base :** sp_base
- **Tables créées automatiquement :** users, products, slides, blogs, features, login_attempts

## 📋 Fonctionnalités Admin

### Dashboard
- Vue d'ensemble des statistiques
- Actions rapides
- Liens utiles

### Gestion des Produits
- ✅ Ajouter/Modifier/Supprimer des produits
- ✅ Spécifications techniques
- ✅ Bénéfices clés
- ✅ Images et SEO
- ✅ Catégories et statuts

### Gestion des Slides
- ✅ Bannières 1920x1080
- ✅ Textes et CTA personnalisés
- ✅ Ordre d'affichage
- ✅ Activation/Désactivation

### Gestion du Blog
- ✅ Articles avec contenu riche
- ✅ Statut brouillon/publié
- ✅ SEO et métadonnées
- ✅ Gestion des auteurs

### Gestion des Fonctionnalités
- ✅ Fonctionnalités du site
- ✅ Icônes et descriptions
- ✅ Ordre d'affichage
- ✅ Activation/Désactivation

## 🔒 Sécurité

- ✅ Authentification JWT
- ✅ Protection brute-force (5 tentatives par IP, 3 par utilisateur)
- ✅ Sessions sécurisées
- ✅ Validation des données
- ✅ Routes protégées

## 🛠️ Architecture

```
src/
├── config/
│   └── database.ts          # Configuration MySQL
├── utils/
│   └── auth.ts              # Authentification et sécurité
├── api/
│   └── admin.ts             # API REST pour l'admin
├── pages/admin/
│   ├── Login.tsx            # Page de connexion
│   ├── Dashboard.tsx        # Tableau de bord
│   ├── Products.tsx         # Liste des produits
│   ├── ProductForm.tsx      # Formulaire produit
│   ├── Slides.tsx           # Liste des slides
│   ├── SlideForm.tsx        # Formulaire slide
│   ├── Blog.tsx             # Liste des articles
│   ├── BlogForm.tsx         # Formulaire article
│   ├── Features.tsx         # Liste des fonctionnalités
│   └── FeatureForm.tsx      # Formulaire fonctionnalité
└── components/admin/
    ├── AdminLayout.tsx      # Layout principal
    └── ProtectedRoute.tsx   # Protection des routes
```

## 📡 API Endpoints

### Authentification
- `POST /api/admin/login` - Connexion admin

### Produits
- `GET /api/admin/products` - Liste des produits
- `GET /api/admin/products/:id` - Détail d'un produit
- `POST /api/admin/products` - Créer un produit
- `PUT /api/admin/products/:id` - Modifier un produit
- `DELETE /api/admin/products/:id` - Supprimer un produit

### Slides
- `GET /api/admin/slides` - Liste des slides
- `POST /api/admin/slides` - Créer un slide
- `PUT /api/admin/slides/:id` - Modifier un slide
- `DELETE /api/admin/slides/:id` - Supprimer un slide

### Blog
- `GET /api/admin/blogs` - Liste des articles
- `POST /api/admin/blogs` - Créer un article
- `PUT /api/admin/blogs/:id` - Modifier un article
- `DELETE /api/admin/blogs/:id` - Supprimer un article

### Fonctionnalités
- `GET /api/admin/features` - Liste des fonctionnalités
- `POST /api/admin/features` - Créer une fonctionnalité
- `PUT /api/admin/features/:id` - Modifier une fonctionnalité
- `DELETE /api/admin/features/:id` - Supprimer une fonctionnalité

### Dashboard
- `GET /api/admin/dashboard/stats` - Statistiques du dashboard

## 🎨 Interface

- **Design moderne** inspiré d'AdminLTE/Material UI
- **Responsive** (desktop et tablette)
- **Menu latéral** avec navigation intuitive
- **Formulaires** clairs et bien étiquetés
- **Confirmations** avant suppression
- **Feedback visuel** pour toutes les actions

## 🔄 Intégration Site Vitrine

Les données créées depuis l'admin apparaissent automatiquement sur le site public :
- Produits dans le catalogue
- Slides dans le slider principal
- Articles dans le blog
- Fonctionnalités dans les sections

## 🚨 Dépannage

### Erreur de connexion à la base de données
Vérifiez que la base MySQL distante est accessible et que les identifiants sont corrects.

### Erreur de build
```bash
npm run build:server
```

### Reset complet
```bash
rm -rf dist node_modules
npm install
npm run build:all
```

## 📝 Notes

- L'admin par défaut est créé automatiquement au premier démarrage
- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT expirent après 24h
- La protection brute-force bloque pendant 15 minutes après 5 échecs
