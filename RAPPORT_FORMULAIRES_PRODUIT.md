# Rapport d’analyse – Formulaire Produit (Ajout & Modification)

## Portée
- Frontend admin: `src/pages/admin/ProductForm.tsx`, `src/pages/admin/Products.tsx`
- Backend: `src/api/admin.ts` (create/update/get), `server.js` (routes), uploads images/PDF
- Schéma/stockage: champs `products` (JSON pour images, specifications, benefits, downloads, etc.)

## Fonctionnalités actuelles (Frontend)
- Formulaire modal `ProductForm` multi-onglets: Informations, Spécifications, Bénéfices, Téléchargements, SEO.
- Champs principaux: `title`, `slug` (auto-généré, éditable), `reference`, `category`, `subcategory` (optionnelle), `short_description`, `long_description`.
- Upload d’images (validation type, 5MB max), gestion des vignettes, définition de l’image principale, suppression.
- Spécifications: liste dynamique d’entrées `{ name, value, unit }` (ajout/suppression/édition).
- Bénéfices: liste dynamique `{ icon, title, description }`.
- Téléchargements: upload PDF (validation type, 10MB max), ajout manuel, édition des champs `{ name, type, url, size, language }`.
- SEO: `meta_title`, `meta_description`.
- Slug: auto-génération depuis `title` avec translittération, possibilité de régénérer manuellement.
- Catégories: fetch dynamique depuis `/api/admin/categories`, sous-catégories dépendantes, remise à zéro si non cohérentes.
- Envoi: POST sur création `/api/admin/products`, PUT sur édition `/api/admin/products/:id` avec JSON complet du formulaire.

## Fonctionnalités actuelles (Backend)
- Endpoints protégés admin:
  - GET `/api/admin/products`, GET `/api/admin/products/:id`
  - POST `/api/admin/products` (create)
  - PUT `/api/admin/products/:id` (update)
  - PATCH `/api/admin/products/:id/visibility` (is_active)
  - DELETE `/api/admin/products/:id`
- Public:
  - GET `/api/products` (list is_active=1, pagination, filtres)
  - GET `/api/products/:slug` (produit actif complet avec parsing JSON)
- Uploads:
  - POST `/api/admin/upload` (image, 5MB)
  - POST `/api/admin/upload-multiple`
  - POST `/api/admin/upload-pdf` (PDF, 10MB)
- Normalisations côté API list/public: si `image_url` vide, utilise le premier `images[].url`.
- Stockage des champs JSON sérialisés dans `products` (images, specifications, benefits, downloads, compatibility, related_products).

## Parcours – Création
1. Admin ouvre `ProductForm` avec `productId = 'new'`.
2. Remplit onglets; upload images/PDF (URLs renvoyées par backend).
3. Soumission POST `/api/admin/products` avec payload:
   - Types robustes; valeurs par défaut appliquées côté API (ex: `is_active: true`, arrays vides, nulls contrôlés).
   - Slug garanti unique (incrément suffixe si collision).
4. En cas de succès, fermeture du modal et rafraîchissement de la liste.

## Parcours – Modification
1. Admin ouvre `ProductForm` avec `productId` existant.
2. Charge le produit via GET `/api/admin/products/:id` et peuple le state (avec parsing implicite côté front car l’API renvoie déjà des types attendus ou JSON brute).
3. Édite et sauvegarde via PUT `/api/admin/products/:id`.
4. API réassure l’unicité du slug si modifié, sérialise les champs JSON et met à jour la ligne.

## Points forts
- Gestion complète et intuitive des champs produit.
- Slug auto + contrôle d’unicité côté serveur.
- Uploads avec validations et retours structurés.
- Catégories dynamiques avec sous-catégories optionnelles.
- Architecture backend robuste: vérifs `SHOW TABLES`, parsing JSON, fallback d’`image_url`.
- Séparation claire des rôles (admin vs public), endpoint de visibilité dédié.

## Observations et améliorations proposées
1. Images – champ principal cohérent
   - Constat: `image_url` peut contenir une URL absolue HTTP (historique), causant Mixed Content. Front a `getImageUrl` pour normaliser.
   - Reco: stocker et renvoyer de préférence des chemins relatifs `/uploads/...` côté backend lors des uploads; le front construit toujours des URLs sécurisées. Server/Nginx déjà configurés pour proxifier `/uploads`.

2. Parsing JSON côté admin GET by id
   - Constat: GET `/api/admin/products/:id` renvoie potentiellement des champs JSON non parsés.
   - Reco: parser systématiquement `images`, `specifications`, `benefits`, `downloads`, `compatibility`, `related_products` côté API admin GET pour homogénéiser (comme `getProductBySlug`).

3. Validation serveur du payload produit
   - Constat: Côté API, les valeurs sont normalisées mais peu de validation métier.
   - Reco: ajouter validations (non-vide pour `title`, `reference`, `category`; formats URL pour `downloads[].url`; tailles arrays limites; longueur `meta_title/description`). Retourner 400 avec messages clairs.

4. Consistance `related_products`
   - Constat: Front attend un array d’IDs côté admin, public enrichit parfois en objets.
   - Reco: définir un contrat: stocker des IDs en DB; admin GET/PUT manipulent IDs; public GET peut hydrater en objets minimalistes si besoin.

5. Règles de slug
   - Constat: slug régénérable sur front; unique côté serveur.
   - Reco: exposer une route de prévisualisation (HEAD/GET `/api/admin/slug-check?slug=...`) si l’UX requiert un feedback immédiat.

6. Téléchargements (PDF)
   - Constat: Upload ok, mais certains anciens `url` absolus HTTP existent.
   - Reco: à la sauvegarde produit, normaliser `downloads[].url` en chemin relatif s’il pointe vers le host backend.

7. Accessibilité/form UX
   - Constat: Bon focus states; champs obligatoires signalés.
   - Reco: messages d’erreur inline par champ; désactivation des boutons en cours de sauvegarde; toasts de succès/erreur.

8. Performance
   - Constat: Modal riche, nombreuses entrées dynamiques.
   - Reco: memoïser listes volumineuses, debouncer sur recherche catégories si futur; lazy mount par onglet si nécessaire.

9. Sécurité
   - Constat: Auth admin via `Bearer`; validations mimetype/tailles pour uploads.
   - Reco: sanitizer HTML pour `long_description` si éditeur riche; limiter nombre max d’images/PDF par produit; audit des types MIME.

10. API pagination/tri admin
   - Constat: GET `/api/admin/products` pagine mais l’UI charge tout par défaut.
   - Reco: exposer filtres/tri/pagination côté admin (params `page`, `limit`, `category`, `is_new`, `search`); UI avec pagination pour grands catalogues.

## Contrat de données recommandé (products)
- Champs scalaires: `title`, `slug`, `reference`, `category`, `subcategory|null`, `short_description`, `long_description`, `is_new:boolean`, `featured:boolean`, `is_active:boolean`, `meta_title|null`, `meta_description|null`.
- Images: `images: Array<{ id:string, url:string, filename:string, originalName:string, size:number, isMain?:boolean }>`.
- `image_url`: facultatif; front s’appuie d’abord sur `images[].url`.
- Spécifications: `Array<{ name:string, value:string, unit?:string }>`.
- Bénéfices: `Array<{ icon?:string, title?:string, description?:string }>`.
- Téléchargements: `Array<{ name:string, type:string, url:string, size?:string, language?:string }>`.
- Compatibilité: `string[]`.
- Produits associés: `number[]` (IDs).

## Checklist qualité avant mise en prod
- Vérifier que tous les `url` images/PDF sont relatifs `/uploads/...`.
- Vérifier parsing JSON côté admin GET by id (sinon parser côté front en fallback).
- Tester création/édition avec: images multiples, bénéfices vides, specs vides, PDF multiples.
- Contrôler l’unicité du slug après modification de `title`.
- Confirmer que `is_active` respecte la visibilité publique.

## Évolutions suggérées (quick wins)
- Parser JSON dans `getProduct` (admin GET by id).
- Normaliser `downloads[].url` côté API au moment du save.
- Ajouter messages d’erreur/succès (toasts) au submit côté front.
- Limiter à N images et M PDFs par produit avec messages clairs.
- Ajouter `updated_at`/`created_at` au payload retourné par create/update.

## Conclusion
L’ensemble est solide et opérationnel. En priorisant la normalisation des URLs, le parsing JSON uniforme dans les endpoints admin et quelques validations supplémentaires, l’expérience d’édition restera fluide tout en renforçant la fiabilité et la conformité (HTTPS, Mixed Content, cohérence des données).
