# 🚀 Walk - E-commerce de Sneakers Premium

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload%20CMS-3.56.0-blue)](https://payloadcms.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-18.5.0-purple)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.3-cyan)](https://tailwindcss.com/)

> **Walk** est une plateforme e-commerce moderne et complète spécialisée dans la vente de sneakers premium, avec un système de reprise de chaussures d'occasion et une gestion avancée des stocks.

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités principales](#-fonctionnalités-principales)
- [🏗️ Architecture technique](#️-architecture-technique)
- [🚀 Installation et configuration](#-installation-et-configuration)
- [👥 Système d'authentification](#-système-dauthentification)
- [🛒 Système de commandes](#-système-de-commandes)
- [💳 Intégration Stripe](#-intégration-stripe)
- [📦 Gestion des produits](#-gestion-des-produits)
- [🔄 Système de reprise](#-système-de-reprise)
- [📊 Administration](#-administration)
- [🔧 Scripts et outils](#-scripts-et-outils)
- [🌐 Déploiement](#-déploiement)
- [📚 Documentation](#-documentation)
- [🤝 Contribution](#-contribution)

## 🎯 Vue d'ensemble

**Walk** est une plateforme e-commerce complète construite avec les technologies les plus modernes du web. Elle combine la puissance de Payload CMS pour la gestion de contenu, Next.js pour les performances, et Stripe pour les paiements sécurisés.

### 🎨 Identité visuelle
- **Logo** : Chaussure orange stylisée avec le texte "Walk"
- **Couleurs** : Orange (#FF8C00) et blanc
- **Design** : Moderne, minimaliste et responsive

## ✨ Fonctionnalités principales

### 🛍️ E-commerce complet
- **Catalogue produits** avec filtres avancés (catégorie, taille, marque, couleur, prix)
- **Pages produits détaillées** avec galerie d'images et variantes
- **Panier intelligent** avec gestion des quantités
- **Système de commandes** complet avec suivi
- **Gestion des stocks** en temps réel

### 💳 Paiements sécurisés
- **Intégration Stripe** complète
- **Calcul automatique de la TVA** (20%)
- **Sessions de paiement** sécurisées
- **Webhooks** pour la synchronisation des statuts
- **Cartes de test** intégrées pour le développement

### 🔄 Système de reprise
- **Landing page** dédiée à la reprise
- **Formulaire de demande** avec upload d'images
- **Évaluation des chaussures** par les administrateurs
- **Suivi des demandes** dans l'espace client
- **Gestion des statuts** (en attente, acceptée, refusée, etc.)

### 👤 Gestion des utilisateurs
- **3 rôles distincts** : Admin, Vendeur, Client
- **Authentification** sécurisée
- **Espace client** personnalisé
- **Historique des commandes**
- **Gestion des reprises**

### 🔍 Fonctionnalités avancées
- **Recherche intelligente** avec suggestions
- **Pagination** optimisée (53 produits par page)
- **Images optimisées** avec redimensionnement automatique
- **SEO** intégré
- **Mode sombre/clair**
- **Responsive design**

## 🏗️ Architecture technique

### 🛠️ Stack technologique

#### Frontend
- **Next.js 15.4.4** - Framework React avec App Router
- **React 19.1.0** - Bibliothèque UI
- **TypeScript 5.7.3** - Typage statique
- **Tailwind CSS 3.4.3** - Framework CSS
- **shadcn/ui** - Composants UI modernes
- **Lucide React** - Icônes

#### Backend & CMS
- **Payload CMS 3.56.0** - Headless CMS
- **PostgreSQL** - Base de données relationnelle
- **Sharp** - Traitement d'images

#### Paiements
- **Stripe 18.5.0** - Plateforme de paiement
- **@stripe/stripe-js** - SDK Stripe
- **@stripe/react-stripe-js** - Composants React Stripe

#### Développement
- **ESLint** - Linting du code
- **Prettier** - Formatage du code
- **Playwright** - Tests E2E
- **Vitest** - Tests unitaires

### 📁 Structure du projet

```
mon-ecommerce/
├── 📁 src/
│   ├── 📁 app/                    # Pages Next.js
│   │   ├── 📁 (frontend)/         # Pages publiques
│   │   ├── 📁 (payload)/          # Interface Payload
│   │   └── 📁 api/                # API Routes
│   ├── 📁 collections/            # Collections Payload
│   ├── 📁 components/             # Composants React
│   ├── 📁 contexts/               # Contextes React
│   ├── 📁 lib/                    # Utilitaires
│   └── 📁 utilities/              # Fonctions utilitaires
├── 📁 public/                     # Assets statiques
│   ├── 📁 media/                  # Images uploadées
│   └── 🖼️ logo-walk.svg          # Logo principal
├── 📁 scripts/                    # Scripts Python
└── 📄 Documentation/              # Documentation
```

## 🚀 Installation et configuration

### 📋 Prérequis

- **Node.js** : ^18.20.2 || >=20.9.0
- **pnpm** : ^9 || ^10
- **PostgreSQL** : Base de données
- **Python 3.8+** : Pour les scripts d'import

### 🔧 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd mon-ecommerce
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

4. **Variables d'environnement requises**
```env
# Base de données
DATABASE_URI=postgresql://username:password@localhost:5432/walk_ecommerce

# Payload CMS
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
PAYLOAD_ADMIN_EMAIL=admin@sneakers.com
PAYLOAD_ADMIN_PASSWORD=123Soleil
```

5. **Démarrer le serveur de développement**
```bash
pnpm dev
```

6. **Accéder à l'application**
- **Frontend** : http://localhost:3000
- **Admin Payload** : http://localhost:3000/admin

### 🐳 Installation avec Docker

```bash
# Démarrer avec Docker Compose
docker-compose up

# En arrière-plan
docker-compose up -d
```

## 👥 Système d'authentification

### 🔐 Rôles utilisateurs

#### 👑 Admin
- **Accès complet** au CMS Payload
- **Gestion des utilisateurs** (création, modification, suppression)
- **Gestion des produits** et commandes
- **Validation des reprises**
- **Configuration système**

#### 👨‍💼 Vendeur
- **Accès au CMS** (sauf gestion des utilisateurs)
- **Gestion des produits** et stocks
- **Suivi des commandes**
- **Validation des reprises**
- **Gestion des médias**

#### 👤 Client
- **Accès public** uniquement
- **Espace personnel** avec commandes
- **Demandes de reprise**
- **Pas d'accès** au CMS

### 🔑 Authentification

```typescript
// Exemple de création d'utilisateur
const user = {
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  role: "client", // client, vendeur, admin
  password: "securePassword"
}
```

## 🛒 Système de commandes

### 📦 Processus de commande

1. **Ajout au panier** - Gestion en localStorage
2. **Vérification du stock** - Contrôle en temps réel
3. **Informations de livraison** - Formulaire complet
4. **Création de la commande** - Enregistrement en base
5. **Paiement Stripe** - Session sécurisée
6. **Confirmation** - Email et redirection
7. **Mise à jour du stock** - Automatique

### 🏷️ Statuts des commandes

- `REQUIRES_PAYMENT` - En attente de paiement
- `PAID` - Payée
- `confirmed` - Confirmée
- `shipped` - Expédiée
- `delivered` - Livrée
- `cancelled` - Annulée
- `FAILED` - Échec de paiement

## 💳 Intégration Stripe

### 🔧 Configuration

```typescript
// src/lib/stripe.ts
export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-08-27.basil',
})

export const stripeConfig = {
  publishableKey,
  currency: 'eur',
  country: 'FR',
  locale: 'fr',
}
```

### 💰 Fonctionnalités Stripe

- **Sessions de paiement** sécurisées
- **Calcul automatique de la TVA** (20%)
- **Webhooks** pour la synchronisation
- **Cartes de test** intégrées
- **Gestion des erreurs** complète

### 🧪 Cartes de test

```bash
# Carte de test réussie
4242 4242 4242 4242

# Carte de test échouée
4000 0000 0000 0002

# Carte 3D Secure
4000 0025 0000 3155
```

## 📦 Gestion des produits

### 🏷️ Structure des produits

```typescript
interface Product {
  id: string
  title: string
  slug: string
  category: 'homme' | 'femme' | 'enfants' | 'unisexe'
  price: number
  stock: number
  isInStock: boolean
  description: RichText
  images: Media[]
  variants: Variant[]
  isFeatured: boolean
  isNewArrival: boolean
  rating: number
  reviewCount: number
}
```

### 🖼️ Gestion des images

- **Upload automatique** vers `/public/media/`
- **Redimensionnement** automatique (300x300, 500x500, 600x600, etc.)
- **Optimisation** avec Sharp
- **Fallback** vers placeholder si image manquante

### 📊 Gestion des stocks

- **Stock global** par produit
- **Stock par variante** (taille, couleur)
- **Mise à jour automatique** après commande
- **Alertes** de stock faible
- **Désactivation** automatique si stock = 0

## 🔄 Système de reprise

### 📋 Processus de reprise

1. **Landing page** - Présentation du concept
2. **Formulaire de demande** - Informations détaillées
3. **Upload d'images** - Photos des chaussures
4. **Soumission** - Création de la demande
5. **Évaluation** - Par les administrateurs
6. **Validation/Refus** - Notification au client
7. **Paiement** - Si acceptée
8. **Expédition** - Envoi des chaussures

### 🏷️ Statuts des reprises

- `pending` - En attente
- `evaluating` - En évaluation
- `accepted` - Acceptée
- `rejected` - Refusée
- `paid` - Payée
- `shipped` - Expédiée
- `received` - Réceptionnée
- `cancelled` - Annulée

### 📝 Informations collectées

```typescript
interface Reprise {
  reference: string
  customerEmail: string
  customer: User
  status: RepriseStatus
  shoeDetails: {
    brand: string
    model: string
    size: number
    color: string
    condition: 'new_with_box' | 'new_without_box' | 'very_good' | 'good' | 'fair'
  }
  evaluation: {
    estimatedValue: number
    offerPrice: number
    evaluationNotes: string
  }
  images: Media[]
}
```

## 📊 Administration

### 🎛️ Interface Payload CMS

- **Dashboard** complet avec statistiques
- **Gestion des produits** avec prévisualisation
- **Suivi des commandes** en temps réel
- **Validation des reprises** avec interface dédiée
- **Gestion des utilisateurs** et permissions
- **Upload de médias** avec optimisation

### 📈 Statistiques disponibles

- **Ventes** par période
- **Produits** les plus vendus
- **Commandes** en cours
- **Reprises** en attente
- **Utilisateurs** actifs

## 🔧 Scripts et outils

### 🐍 Scripts Python

#### Import de produits
```bash
# Import depuis CSV
python scripts/import_products.py

# Import avec options
python scripts/import_products.py --force  # Import tous les produits
python scripts/import_products.py --limit 50  # Limite à 50 produits
```

#### Gestion des stocks
```bash
# Mise à jour des stocks
python scripts/update_stocks.py

# Vérification des stocks
python scripts/check_stocks.py
```

#### Nettoyage
```bash
# Suppression des produits
python scripts/delete_products.py

# Correction des références média
python scripts/fix_media_references.py
```

### 📊 Scripts de maintenance

```bash
# Vérification de la base de données
pnpm payload migrate:status

# Génération des types TypeScript
pnpm generate:types

# Linting et formatage
pnpm lint
pnpm lint:fix
```

## 🌐 Déploiement

### 🚀 Déploiement sur Vercel

1. **Configuration Vercel**
```bash
# Installation de l'adaptateur Vercel
pnpm add @payloadcms/db-vercel-postgres
```

2. **Variables d'environnement**
```env
POSTGRES_URL=postgresql://...
PAYLOAD_SECRET=your-secret
STRIPE_SECRET_KEY=sk_live_...
```

3. **Déploiement**
```bash
# Build de production
pnpm build

# Déploiement
vercel --prod
```

### 🐳 Déploiement avec Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### ☁️ Déploiement sur Payload Cloud

1. **Connexion GitHub** à Payload Cloud
2. **Configuration** des variables d'environnement
3. **Déploiement automatique** à chaque push

## 📚 Documentation

### 📖 Documentation technique

- [Système d'authentification](AUTHENTICATION_SYSTEM.md)
- [Intégration Stripe](STRIPE_SETUP_README.md)
- [Système de panier](CART_SYSTEM_DOCUMENTATION.md)
- [Gestion des commandes](CHECKOUT_SYSTEM_DOCUMENTATION.md)
- [Système de permissions](PERMISSIONS_SYSTEM_DOCUMENTATION.md)
- [Pages produits](PRODUCT_PAGE_DOCUMENTATION.md)
- [Système de reprise](RGPD_COOKIES_DOCUMENTATION.md)

### 🔧 Guides de développement

- [Configuration de l'environnement](guide.md)
- [Structure du projet](FRONTEND_README.md)
- [Tests et qualité](playwright.config.ts)
- [Optimisation des performances](next.config.js)

### 🎨 Design System

- **Couleurs** : Orange (#FF8C00), Blanc, Gris
- **Typographie** : Geist, système de polices
- **Composants** : shadcn/ui, Tailwind CSS
- **Icônes** : Lucide React

## 🤝 Contribution

### 🔄 Workflow de développement

1. **Fork** du repository
2. **Création** d'une branche feature
3. **Développement** avec tests
4. **Pull Request** avec description détaillée
5. **Review** et merge

### 📝 Standards de code

- **TypeScript** strict
- **ESLint** et **Prettier** configurés
- **Tests** unitaires et E2E
- **Documentation** des nouvelles fonctionnalités

### 🐛 Signalement de bugs

1. **Vérification** des issues existantes
2. **Création** d'une issue détaillée
3. **Reproduction** du bug
4. **Fix** et tests

## 📞 Support et contact

### 💬 Communauté

- **Discord** : [Payload Community](https://discord.com/invite/payload)
- **GitHub** : [Issues et Discussions](https://github.com/payloadcms/payload/discussions)
- **Documentation** : [Payload CMS Docs](https://payloadcms.com/docs)

### 📧 Contact technique

- **Email** : admin@sneakers.com
- **Support** : Via GitHub Issues
- **Documentation** : README et docs techniques

---

## 🎉 Remerciements

Ce projet utilise les technologies suivantes :

- **[Payload CMS](https://payloadcms.com/)** - Headless CMS moderne
- **[Next.js](https://nextjs.org/)** - Framework React
- **[Stripe](https://stripe.com/)** - Plateforme de paiement
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Composants UI

---

**Walk** - Votre destination premium pour les sneakers 🚀👟

*Développé avec ❤️ et les technologies les plus modernes du web*
