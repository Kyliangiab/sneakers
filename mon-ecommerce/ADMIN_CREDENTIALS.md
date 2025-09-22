# 👑 Compte Administrateur Payload CMS

## 📋 Informations de Connexion

### **Compte Admin Principal**
- **Email** : `admin@sneakers.com`
- **Mot de passe** : `123Soleil`
- **Rôle** : `admin`
- **Nom complet** : `Admin Sneakers`
- **ID** : `5`

### **URL d'Administration**
- **Interface Admin** : `http://localhost:3000/admin`
- **API Endpoint** : `http://localhost:3000/api/users`

## 🔐 Détails Techniques

### **Création du Compte**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Sneakers",
    "firstName": "Admin",
    "lastName": "Sneakers",
    "email": "admin@sneakers.com",
    "password": "123Soleil",
    "role": "admin"
  }'
```

### **Réponse de Création**
```json
{
  "doc": {
    "id": 5,
    "name": "Admin Sneakers",
    "firstName": "Admin",
    "lastName": "Sneakers",
    "role": "admin",
    "updatedAt": "2025-09-19T20:44:21.636Z",
    "createdAt": "2025-09-19T20:44:21.636Z",
    "email": "admin@sneakers.com",
    "sessions": []
  },
  "message": "User successfully created."
}
```

### **Test de Connexion**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sneakers.com",
    "password": "123Soleil"
  }'
```

### **Réponse de Connexion**
```json
{
  "message": "Authentication Passed",
  "exp": 1758321868,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "Admin Sneakers",
    "firstName": "Admin",
    "lastName": "Sneakers",
    "role": "admin",
    "email": "admin@sneakers.com",
    "sessions": [...]
  }
}
```

## 🎯 Permissions Admin

### **Accès Complet**
- ✅ **Gestion des utilisateurs** : Créer/modifier/supprimer tous les utilisateurs
- ✅ **Gestion des produits** : CRUD complet sur tous les produits
- ✅ **Gestion des commandes** : Voir toutes les commandes, modifier statuts
- ✅ **Gestion des médias** : Upload et gestion des images
- ✅ **Configuration** : Paramètres système et collections
- ✅ **Analytics** : Rapports et statistiques

### **Collections Accessibles**
- ✅ **Users** : Gestion des utilisateurs et rôles
- ✅ **Products** : Gestion des produits et variantes
- ✅ **Orders** : Gestion des commandes
- ✅ **Customers** : Gestion des clients
- ✅ **Media** : Gestion des images et fichiers
- ✅ **Pages** : Gestion des pages du site
- ✅ **Posts** : Gestion des articles de blog
- ✅ **Categories** : Gestion des catégories

## 🚀 Utilisation

### **Connexion à l'Interface Admin**
1. **Ouvrir** : `http://localhost:3000/admin`
2. **Saisir** : `admin@sneakers.com`
3. **Saisir** : `123Soleil`
4. **Cliquer** : "Se connecter"

### **Fonctionnalités Disponibles**
- ✅ **Dashboard** : Vue d'ensemble du système
- ✅ **Collections** : Gestion de toutes les données
- ✅ **Médias** : Upload et gestion des fichiers
- ✅ **Utilisateurs** : Gestion des comptes et rôles
- ✅ **Configuration** : Paramètres du système

## 🔒 Sécurité

### **Bonnes Pratiques**
- ✅ **Mot de passe fort** : `123Soleil` (à changer en production)
- ✅ **Rôle admin** : Accès complet au système
- ✅ **Sessions** : Gestion automatique des sessions
- ✅ **JWT** : Tokens sécurisés pour l'authentification

### **Recommandations**
- 🔄 **Changer le mot de passe** en production
- 🔄 **Utiliser HTTPS** en production
- 🔄 **Limiter l'accès** par IP si nécessaire
- 🔄 **Audit des logs** régulièrement

## 📱 Accès Mobile

### **Interface Responsive**
- ✅ **Mobile** : Interface adaptée aux mobiles
- ✅ **Tablet** : Interface optimisée pour tablettes
- ✅ **Desktop** : Interface complète sur ordinateur

### **Fonctionnalités Mobile**
- ✅ **Navigation** : Menu hamburger
- ✅ **Formulaires** : Saisie tactile optimisée
- ✅ **Médias** : Upload d'images depuis mobile
- ✅ **Recherche** : Recherche rapide

## 🔧 Maintenance

### **Création d'Utilisateurs Supplémentaires**
```bash
# Créer un vendeur
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vendeur Test",
    "firstName": "Vendeur",
    "lastName": "Test",
    "email": "vendeur@sneakers.com",
    "password": "password123",
    "role": "vendeur"
  }'

# Créer un client
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Client Test",
    "firstName": "Client",
    "lastName": "Test",
    "email": "client@sneakers.com",
    "password": "password123",
    "role": "client"
  }'
```

### **Liste des Utilisateurs**
```bash
# Voir tous les utilisateurs
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Statistiques

### **Utilisateurs Créés**
- ✅ **Admin** : `admin@sneakers.com` (ID: 5)
- ✅ **Test User** : `test@example.com` (ID: 3)
- ✅ **Nouveau User** : `nouveau@example.com` (ID: 4)

### **Rôles Disponibles**
- ✅ **admin** : Accès complet
- ✅ **vendeur** : Gestion produits/commandes
- ✅ **client** : Utilisateur standard

---

**Le compte administrateur est maintenant créé et fonctionnel !** 🎉

**Tu peux accéder à l'interface admin à l'adresse : `http://localhost:3000/admin`** ✅

