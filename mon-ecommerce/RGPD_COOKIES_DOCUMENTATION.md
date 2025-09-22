# Documentation RGPD et Cookies

## 🛡️ **Pages créées**

### **1. Page RGPD (`/rgpd`)**
- **Politique de confidentialité complète**
- **Conformité RGPD**
- **Droits des utilisateurs**
- **Sécurité des données**
- **Gestion des cookies**

### **2. Page Politique de Retour (`/politique-retour`)**
- **Délai de retour (14 jours)**
- **Conditions de retour**
- **Procédure détaillée**
- **Remboursement**
- **Échanges**

### **3. Popup de Consentement Cookies**
- **Banner d'acceptation**
- **Préférences personnalisables**
- **3 catégories de cookies**
- **Sauvegarde des préférences**

## 🍪 **Système de Cookies**

### **Catégories de cookies**

#### **Cookies essentiels** (toujours actifs)
- Session utilisateur
- Panier d'achat
- Authentification
- Sécurité

#### **Cookies analytiques** (optionnels)
- Google Analytics
- Statistiques d'utilisation
- Performance du site

#### **Cookies marketing** (optionnels)
- Publicités ciblées
- Réseaux sociaux
- Retargeting

### **Fonctionnalités du popup**

#### **Banner principal**
- Apparaît au premier visit
- 3 options : Accepter tout, Essentiels uniquement, Personnaliser
- Liens vers les politiques

#### **Modal de préférences**
- Toggle pour chaque catégorie
- Description détaillée
- Sauvegarde des choix

#### **Stockage des préférences**
```javascript
localStorage.setItem('cookie-consent', 'true')
localStorage.setItem('cookie-preferences', JSON.stringify({
  essential: true,
  analytics: false,
  marketing: false
}))
```

## 🔧 **Intégration technique**

### **Composant CookieConsent**
- **Fichier :** `src/app/(frontend)/components/CookieConsent.tsx`
- **Fonctionnalités :**
  - État de consentement
  - Modal de préférences
  - Sauvegarde localStorage
  - Intégration analytics

### **Layout principal**
- **Fichier :** `src/app/(frontend)/layout.tsx`
- **Intégration :** Composant ajouté au layout
- **Position :** Fixed bottom avec z-index élevé

### **Footer**
- **Fichier :** `src/Footer/Component.tsx`
- **Liens ajoutés :**
  - RGPD
  - Politique de retour

## 📋 **Conformité RGPD**

### **Obligations respectées**

#### **1. Consentement éclairé**
- ✅ Information claire sur l'utilisation
- ✅ Choix granulaire par catégorie
- ✅ Possibilité de refuser
- ✅ Retrait du consentement

#### **2. Transparence**
- ✅ Politique de confidentialité détaillée
- ✅ Base légale du traitement
- ✅ Durée de conservation
- ✅ Droits des utilisateurs

#### **3. Droits des utilisateurs**
- ✅ Droit d'accès
- ✅ Droit de rectification
- ✅ Droit d'effacement
- ✅ Droit à la portabilité
- ✅ Droit d'opposition
- ✅ Droit de limitation

#### **4. Sécurité**
- ✅ Chiffrement des données
- ✅ Accès restreint
- ✅ Sauvegardes sécurisées
- ✅ Audits réguliers

## 🎯 **Utilisation**

### **Pour l'utilisateur**

#### **Première visite**
1. Le popup de cookies apparaît
2. Choix entre 3 options
3. Préférences sauvegardées

#### **Gestion des préférences**
1. Cliquer sur "Personnaliser"
2. Activer/désactiver les catégories
3. Sauvegarder les choix

#### **Accès aux politiques**
- Footer : Liens RGPD et Politique de retour
- Popup : Liens directs

### **Pour le développeur**

#### **Intégration analytics**
```javascript
// Dans CookieConsent.tsx
if (prefs.analytics) {
  // Activer Google Analytics
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}
```

#### **Vérification du consentement**
```javascript
const consent = localStorage.getItem('cookie-consent');
const preferences = JSON.parse(localStorage.getItem('cookie-preferences'));
```

## 🚀 **Déploiement**

### **Pages à créer**
- ✅ `/rgpd` - Page RGPD
- ✅ `/politique-retour` - Politique de retour

### **Composants à intégrer**
- ✅ `CookieConsent` dans le layout
- ✅ Liens dans le footer

### **Configuration requise**
- ✅ Analytics (Google Analytics, etc.)
- ✅ Marketing (Facebook Pixel, etc.)
- ✅ Contact DPO

## 📞 **Contact et support**

### **Délégué à la Protection des Données**
- **Email :** dpo@sneakers.com
- **Téléphone :** 01 23 45 67 89

### **Service client**
- **Email :** rgpd@sneakers.com
- **Retours :** retour@sneakers.com

### **Autorité de contrôle**
- **CNIL :** Commission Nationale de l'Informatique et des Libertés
- **Site :** www.cnil.fr

## 🔄 **Mise à jour**

### **Révision régulière**
- Politiques mises à jour selon la législation
- Nouvelles fonctionnalités de cookies
- Évolution des pratiques

### **Audit de conformité**
- Vérification trimestrielle
- Tests de consentement
- Validation juridique

---

**Dernière mise à jour :** {new Date().toLocaleDateString('fr-FR')}
