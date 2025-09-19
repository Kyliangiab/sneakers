# 🎨 Frontend E-commerce Sneakers

## 📋 Vue d'ensemble

Frontend moderne inspiré de Nike pour le site e-commerce de sneakers, développé avec Next.js 14, TypeScript et Tailwind CSS.

## 🏗️ Structure des Composants

### **Composants Principaux**

#### **Header** (`/src/app/(frontend)/components/Header.tsx`)
- **Navigation** : Logo, menu (Homme, Femme, Enfants, Boutique, Seconde main)
- **Actions** : Panier avec badge, compte utilisateur
- **Responsive** : Menu mobile avec hamburger
- **Design** : Style Nike avec couleurs noir/orange

#### **HeroSlider** (`/src/app/(frontend)/components/HeroSlider.tsx`)
- **Fullscreen** : Prend toute la largeur et hauteur de la page
- **Auto-play** : Changement automatique toutes les 5 secondes
- **Navigation** : Flèches et indicateurs dots
- **Contenu** : Titre, sous-titre, description, CTA
- **Images** : Support des images avec overlay

#### **ProductCard** (`/src/app/(frontend)/components/ProductCard.tsx`)
- **Design Nike** : Inspiré de l'image de référence fournie
- **Badge "Nouveau"** : Affichage conditionnel
- **Étoiles** : Système de notation avec avis
- **Prix** : Formatage en euros
- **Hover** : Effets de survol et transitions
- **Responsive** : Adapté mobile/desktop

#### **FeaturedProducts** (`/src/app/(frontend)/components/FeaturedProducts.tsx`)
- **4 produits** : Affichage de 4 produits sélectionnés
- **API** : Récupération depuis Payload CMS
- **Fallback** : Produits mockés si API indisponible
- **Loading** : Spinner de chargement
- **CTA** : Bouton "Voir toute la collection"

#### **RepriseSection** (`/src/app/(frontend)/components/RepriseSection.tsx`)
- **Section dédiée** : Redirection vers la reprise de chaussures
- **Features** : Prix équitable, processus rapide, sécurisé
- **Design** : Gradient orange, icônes, CTA
- **Responsive** : Grille adaptative

#### **Footer** (`/src/app/(frontend)/components/Footer.tsx`)
- **Simple** : Design épuré comme demandé
- **Liens** : Boutique, Support, Entreprise
- **Contact** : Email, téléphone, adresse
- **Social** : Réseaux sociaux
- **Legal** : Mentions légales

### **Composants Utilitaires**

#### **LoadingSpinner** (`/src/app/(frontend)/components/LoadingSpinner.tsx`)
- **Tailles** : sm, md, lg
- **Accessibilité** : ARIA labels
- **Style** : Spinner orange Nike

## 🎨 Design System

### **Palette de Couleurs**
- **Primaire** : Noir (#000000)
- **Secondaire** : Blanc (#FFFFFF)
- **Accent** : Orange Nike (#FF6900)
- **Gris** : #F5F5F5, #E5E5E5, #CCCCCC
- **Succès** : Vert (#00C851)
- **Erreur** : Rouge (#FF4444)

### **Typographie**
- **Police** : Inter (moderne, lisible)
- **Tailles** : 12px, 14px, 16px, 18px, 24px, 32px, 48px
- **Poids** : Regular, Medium, Bold

### **Composants UI**
- **Boutons** : Primary (orange), Secondary (noir), Ghost
- **Cards** : Ombres subtiles, coins arrondis
- **Transitions** : 200-300ms, ease-in-out
- **Hover** : Effets de lift et changement de couleur

## 📱 Responsive Design

### **Breakpoints**
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### **Adaptations**
- **Header** : Menu hamburger sur mobile
- **Hero** : Texte adaptatif, images responsives
- **Produits** : Grille 1/2/4 colonnes
- **Reprise** : Stack vertical sur mobile

## 🔧 API et Données

### **Route API** (`/src/app/api/products/route.ts`)
- **Endpoint** : `/api/products`
- **Paramètres** : `limit`, `random`, `category`
- **Payload** : Intégration avec Payload CMS
- **Fallback** : Produits mockés en cas d'erreur

### **Images Placeholder** (`/src/app/api/placeholder/[...params]/route.ts`)
- **Génération** : Images dynamiques avec dimensions
- **Style** : Pattern de damier, icône sneaker
- **Performance** : Optimisé pour le web

## 🚀 Fonctionnalités

### **Implémentées**
- ✅ **Header** avec navigation complète
- ✅ **Hero slider** fullscreen
- ✅ **Section produits** avec 4 produits
- ✅ **Section reprise** chaussures
- ✅ **Footer** simple
- ✅ **ProductCard** inspiré Nike
- ✅ **Responsive** design
- ✅ **Loading** states
- ✅ **API** integration

### **À venir**
- 🔄 **Authentification** (prochaine étape)
- 🔄 **Panier** fonctionnel
- 🔄 **Pages produits** détaillées
- 🔄 **Recherche** avancée
- 🔄 **Paiement** Stripe

## 🛠️ Technologies Utilisées

- **Next.js 14** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling utility-first
- **Lucide React** : Icônes
- **Payload CMS** : Backend et API

## 📁 Structure des Fichiers

```
src/app/(frontend)/
├── components/
│   ├── Header.tsx
│   ├── HeroSlider.tsx
│   ├── ProductCard.tsx
│   ├── FeaturedProducts.tsx
│   ├── RepriseSection.tsx
│   ├── Footer.tsx
│   └── LoadingSpinner.tsx
├── page.tsx
└── globals.css

src/app/api/
├── products/
│   └── route.ts
└── placeholder/
    └── [...params]/
        └── route.ts
```

## 🎯 Prochaines Étapes

1. **Système d'authentification** avec 3 rôles
2. **Gestion des stocks** en temps réel
3. **Processus d'achat** complet
4. **Intégration Stripe** pour les paiements
5. **Tests** unitaires et E2E

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

Le frontend est maintenant prêt et fonctionnel ! 🎉
