# 🔐 Système de Permissions Payload CMS

## 📋 **Vue d'ensemble**

Le système de permissions a été configuré pour gérer 3 rôles distincts avec des accès différenciés au CMS Payload.

## 👥 **Rôles et Permissions**

### 🔴 **ADMIN** - Accès complet
- ✅ **Gestion des utilisateurs** (Users) - CRUD complet
- ✅ **Gestion des produits** (Products) - CRUD complet
- ✅ **Gestion des commandes** (Orders) - CRUD complet
- ✅ **Gestion des clients** (Customers) - CRUD complet
- ✅ **Gestion des médias** (Media) - CRUD complet
- ✅ **Gestion des catégories** (Categories) - CRUD complet
- ✅ **Configuration système** - Accès complet

### 🟡 **VENDEUR** - Accès limité
- ❌ **Gestion des utilisateurs** (Users) - **INTERDIT**
- ✅ **Gestion des produits** (Products) - CRUD complet
- ✅ **Gestion des commandes** (Orders) - CRUD complet
- ✅ **Gestion des clients** (Customers) - CRUD complet
- ✅ **Gestion des médias** (Media) - CRUD complet
- ✅ **Gestion des catégories** (Categories) - CRUD complet

### 🟢 **CLIENT** - Aucun accès CMS
- ❌ **Pas d'accès au CMS** du tout
- ✅ **Accès frontend uniquement** (achat, compte, commandes)

## 🛠️ **Configuration Technique**

### **Fichiers de contrôle d'accès créés :**

#### `src/access/adminOnly.ts`
```typescript
// Accès réservé uniquement aux administrateurs
export const adminOnly: Access = ({ req: { user } }) => {
  if (user && user.role === 'admin') {
    return true
  }
  return false
}
```

#### `src/access/adminOrVendeur.ts`
```typescript
// Accès pour les administrateurs et vendeurs
export const adminOrVendeur: Access = ({ req: { user } }) => {
  if (user && (user.role === 'admin' || user.role === 'vendeur')) {
    return true
  }
  return false
}
```

#### `src/access/authenticated.ts`
```typescript
// Accès pour tous les utilisateurs authentifiés
export const authenticated: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }
  return false
}
```

### **Collections configurées :**

#### **Users** - `adminOnly`
- **admin** : `adminOnly`
- **create** : `() => true` (pour l'inscription)
- **read/update/delete** : `adminOnly`

#### **Products** - `adminOrVendeur`
- **read** : `() => true` (lecture publique)
- **admin/create/update/delete** : `adminOrVendeur`

#### **Orders** - `adminOrVendeur`
- **read/create/update/delete/admin** : `adminOrVendeur`

#### **Customers** - `adminOrVendeur`
- **read/create/update/delete/admin** : `adminOrVendeur`

#### **Media** - `adminOrVendeur`
- **read** : `anyone` (lecture publique)
- **create/update/delete/admin** : `adminOrVendeur`

#### **Categories** - `adminOrVendeur`
- **read** : `anyone` (lecture publique)
- **create/update/delete/admin** : `adminOrVendeur`

## 🎯 **Comportement dans l'interface**

### **Pour un ADMIN :**
- Voit toutes les collections dans la sidebar
- Peut gérer les utilisateurs (créer, modifier, supprimer)
- Accès complet à toutes les fonctionnalités

### **Pour un VENDEUR :**
- Voit toutes les collections SAUF "Users"
- La section "Users" n'apparaît pas dans la sidebar
- Peut gérer produits, commandes, clients, médias, catégories
- Ne peut pas accéder à la gestion des utilisateurs

### **Pour un CLIENT :**
- Pas d'accès au CMS (`/admin`)
- Redirection vers le frontend
- Peut seulement utiliser le site e-commerce

## 🔧 **Rôle par défaut**

- **Nouveaux utilisateurs** : Rôle `client` par défaut
- **Changement de rôle** : Seuls les admins peuvent modifier les rôles
- **Sécurité** : Les permissions sont vérifiées côté serveur

## 🚀 **Avantages**

1. **Sécurité renforcée** : Chaque rôle a exactement les permissions nécessaires
2. **Interface claire** : Les vendeurs ne voient que ce qui les concerne
3. **Flexibilité** : Facile d'ajouter de nouveaux rôles ou permissions
4. **Audit** : Traçabilité des actions par rôle
5. **Évolutif** : Système modulaire et extensible

## 📝 **Notes importantes**

- Les permissions sont vérifiées à chaque requête
- Impossible de contourner les restrictions côté client
- Les collections publiques (read: anyone) restent accessibles au frontend
- Le système est compatible avec l'authentification Payload existante
