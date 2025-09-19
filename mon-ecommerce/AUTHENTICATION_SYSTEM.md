# 🔐 Système d'Authentification - Documentation

## 📋 Vue d'ensemble

Le système d'authentification a été implémenté avec Payload CMS, permettant l'inscription et la connexion des utilisateurs avec gestion des rôles (Client, Vendeur, Admin).

## 🎨 Design et Interface

### **Page d'Authentification** (`/auth`)
- ✅ **Design** : Largeur réduite (`max-w-sm`) comme sur l'image
- ✅ **Onglets** : "Se connecter" et "S'inscrire" avec basculement
- ✅ **Formulaires** : Validation côté client et serveur
- ✅ **Messages** : Affichage des erreurs et succès
- ✅ **Loading** : États de chargement avec spinners

### **Éléments Visuels**
- ✅ **Background** : Gris clair (`bg-gray-100`)
- ✅ **Container** : Carte blanche centrée et étroite
- ✅ **Couleurs** : Palette orange cohérente
- ✅ **Responsive** : Adaptation mobile/desktop

## 🔧 Fonctionnalités Implémentées

### **1. Collection Users (Payload CMS)**

#### **Configuration** (`/src/collections/Users/index.ts`)
```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: () => true, // Permettre la création pour l'inscription
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  auth: true, // Authentification activée
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'role', type: 'select', options: ['client', 'vendeur', 'admin'], defaultValue: 'client' },
  ],
}
```

#### **Rôles Disponibles**
- ✅ **Client** : Utilisateur standard (défaut)
- ✅ **Vendeur** : Gestion des produits et commandes
- ✅ **Admin** : Accès complet au système

### **2. API d'Inscription** (`/api/auth/register`)

#### **Endpoint** : `POST /api/auth/register`

#### **Paramètres**
```typescript
{
  firstName: string,
  lastName: string,
  email: string,
  password: string
}
```

#### **Validation**
- ✅ **Champs requis** : Tous les champs sont obligatoires
- ✅ **Email** : Format email valide
- ✅ **Mot de passe** : Minimum 6 caractères
- ✅ **Unicité** : Vérification email unique

#### **Réponse de Succès**
```typescript
{
  success: true,
  message: "Compte créé avec succès",
  user: {
    id: string,
    name: string,
    firstName: string,
    lastName: string,
    email: string,
    role: "client"
  }
}
```

#### **Gestion des Erreurs**
- ✅ **400** : Champs manquants ou invalides
- ✅ **409** : Email déjà utilisé
- ✅ **500** : Erreur serveur

### **3. API de Connexion** (`/api/auth/login`)

#### **Endpoint** : `POST /api/auth/login`

#### **Paramètres**
```typescript
{
  email: string,
  password: string
}
```

#### **Validation**
- ✅ **Champs requis** : Email et mot de passe
- ✅ **Authentification** : Vérification via Payload CMS

#### **Réponse de Succès**
```typescript
{
  success: true,
  message: "Connexion réussie",
  user: {
    id: string,
    name: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string
  },
  token: string
}
```

#### **Gestion des Erreurs**
- ✅ **400** : Champs manquants
- ✅ **401** : Email ou mot de passe incorrect
- ✅ **500** : Erreur serveur

## 🎯 Interface Utilisateur

### **Formulaire de Connexion**
- ✅ **Email** : Champ avec icône et validation
- ✅ **Mot de passe** : Toggle visibilité avec icône œil
- ✅ **Se souvenir de moi** : Checkbox
- ✅ **Mot de passe oublié** : Lien vers `/forgot-password`
- ✅ **Bouton** : "Se connecter" avec état de chargement

### **Formulaire d'Inscription**
- ✅ **Prénom** : Pré-rempli avec "Jean"
- ✅ **Nom** : Pré-rempli avec "Dupont"
- ✅ **Email** : Champ avec icône et validation
- ✅ **Mot de passe** : Toggle visibilité
- ✅ **Confirmer mot de passe** : Validation de correspondance
- ✅ **Conditions** : Checkbox obligatoire
- ✅ **Bouton** : "Créer un compte" avec état de chargement

### **Messages de Feedback**
- ✅ **Erreurs** : Affichage en rouge avec bordure
- ✅ **Succès** : Affichage en vert avec bordure
- ✅ **Loading** : Spinners sur les boutons
- ✅ **Validation** : Messages contextuels

## 🔄 Flux d'Utilisation

### **Inscription**
1. **Saisie** : Utilisateur remplit le formulaire
2. **Validation** : Vérification côté client
3. **Envoi** : Requête vers `/api/auth/register`
4. **Création** : Utilisateur créé avec rôle "client"
5. **Feedback** : Message de succès
6. **Redirection** : Basculement vers onglet connexion

### **Connexion**
1. **Saisie** : Utilisateur saisit email/mot de passe
2. **Validation** : Vérification côté client
3. **Envoi** : Requête vers `/api/auth/login`
4. **Authentification** : Vérification via Payload
5. **Feedback** : Message de succès ou erreur
6. **Redirection** : Vers dashboard ou page d'accueil

## 🚀 Fonctionnalités Avancées

### **Gestion d'État**
```typescript
// États de l'interface
const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')

// États des formulaires
const [loginForm, setLoginForm] = useState({ email: '', password: '' })
const [signupForm, setSignupForm] = useState({ firstName: 'Jean', lastName: 'Dupont', email: '', password: '', confirmPassword: '' })
```

### **Validation Côté Client**
- ✅ **Champs requis** : Validation HTML5
- ✅ **Email** : Format email
- ✅ **Mot de passe** : Correspondance des mots de passe
- ✅ **Conditions** : Acceptation obligatoire

### **Gestion des Erreurs**
- ✅ **Messages contextuels** : Erreurs spécifiques
- ✅ **États visuels** : Couleurs et bordures
- ✅ **Feedback immédiat** : Validation en temps réel

## 🔮 Prochaines Étapes

### **Fonctionnalités à Implémenter**
1. **Sessions** : Gestion des sessions utilisateur
2. **Redirection** : Après connexion réussie
3. **Profil** : Page de gestion du profil
4. **Reset Password** : Réinitialisation mot de passe
5. **Email Verification** : Vérification par email

### **Sécurité**
1. **JWT Tokens** : Gestion des tokens
2. **Rate Limiting** : Protection contre les attaques
3. **CSRF Protection** : Protection CSRF
4. **Password Hashing** : Hachage sécurisé (Payload)

### **UX/UI**
1. **Remember Me** : Persistance de session
2. **Auto-login** : Connexion automatique
3. **Logout** : Déconnexion
4. **Profile Menu** : Menu utilisateur

## 📱 Tests et Validation

### **Tests API**
```bash
# Test inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'

# Test connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Tests Interface**
- ✅ **Onglets** : Basculement fonctionnel
- ✅ **Formulaires** : Validation des champs
- ✅ **Messages** : Affichage des erreurs/succès
- ✅ **Loading** : États de chargement
- ✅ **Responsive** : Adaptation mobile/desktop

## 🔧 Configuration Technique

### **Payload CMS**
- ✅ **Collection Users** : Configurée avec authentification
- ✅ **Rôles** : Client, Vendeur, Admin
- ✅ **Champs** : Prénom, nom, email, rôle
- ✅ **Access Control** : Permissions configurées

### **Next.js API Routes**
- ✅ **Route Handler** : API Routes Next.js 13+
- ✅ **Validation** : Validation des données
- ✅ **Error Handling** : Gestion des erreurs
- ✅ **TypeScript** : Typage complet

### **Frontend**
- ✅ **React Hooks** : useState, useEffect
- ✅ **Form Handling** : Gestion des formulaires
- ✅ **API Calls** : fetch avec gestion d'erreurs
- ✅ **Loading States** : États de chargement

---

**Le système d'authentification est maintenant fonctionnel avec Payload CMS !** 🎉

**Prêt pour l'implémentation des sessions et de la gestion des rôles.** ✅
