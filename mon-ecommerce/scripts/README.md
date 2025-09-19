# 🛍️ Scripts d'import de produits

Ce dossier contient les scripts pour importer les produits depuis le fichier CSV vers Payload CMS.

## 📁 Fichiers

- `import_products.py` - Script principal d'import
- `test_import.py` - Script de test de l'environnement
- `setup.sh` - Script de configuration
- `requirements.txt` - Dépendances Python

## 🚀 Installation

1. **Installer les dépendances Python :**
   ```bash
   cd scripts
   pip3 install -r requirements.txt
   ```

2. **Ou utiliser le script de setup :**
   ```bash
   ./setup.sh
   ```

## ⚙️ Configuration

1. **Démarrer Payload :**
   ```bash
   pnpm dev
   ```

2. **Créer un utilisateur admin :**
   - Aller sur http://localhost:3000/admin
   - Créer un compte administrateur

3. **Modifier les credentials dans `import_products.py` :**
   ```python
   ADMIN_EMAIL = "ton-email@example.com"
   ADMIN_PASSWORD = "ton-mot-de-passe"
   ```

## 🧪 Test

Avant l'import, teste ton environnement :

```bash
python3 test_import.py
```

Ce script vérifie :
- ✅ Connexion à l'API Payload
- ✅ Authentification
- ✅ Lecture du fichier CSV

## 📦 Import

Lancer l'import :

```bash
python3 import_products.py
```

Le script va :
- 📄 Lire le fichier CSV des produits
- 🖼️ Télécharger et uploader les images
- 🏷️ Créer les produits avec variantes (couleur, matière)
- 💾 Importer tout dans Payload CMS

## 🎯 Fonctionnalités

### Mapping des données
- **Catégories** : Homme/Femme → clothing, Sneakers → sports
- **Images** : Téléchargement automatique depuis les URLs
- **Variantes** : Couleur et matière comme variantes
- **Slugs** : Génération automatique depuis le nom + référence

### Gestion des erreurs
- ⚠️ Gestion des images manquantes
- 🔄 Retry automatique pour les uploads
- 📊 Rapport détaillé des succès/échecs

## 📊 Structure des produits créés

```json
{
  "title": "Nom du produit",
  "slug": "nom-du-produit-reference",
  "category": "clothing|sports|electronics|home",
  "price": 79.95,
  "description": "Description riche avec détails techniques",
  "shortDescription": "Description courte",
  "images": [
    {
      "image": "media_id",
      "alt": "Description de l'image"
    }
  ],
  "variants": [
    {
      "name": "Couleur",
      "value": "Noir",
      "stock": 10,
      "price": null
    }
  ],
  "isFeatured": false,
  "isNewArrival": false,
  "rating": 4.0,
  "reviewCount": 0
}
```

## 🔧 Personnalisation

Tu peux modifier le script pour :
- 🎨 Ajouter d'autres variantes (taille, style)
- 📈 Ajuster les notes et avis
- 🏷️ Modifier le mapping des catégories
- 🖼️ Changer le nombre d'images par produit

## ❓ Problèmes courants

### Erreur de connexion
- Vérifie que Payload est démarré (`pnpm dev`)
- Vérifie l'URL dans le script

### Erreur d'authentification
- Crée un utilisateur admin dans Payload
- Vérifie email/mot de passe dans le script

### Images non uploadées
- Vérifie ta connexion internet
- Certaines URLs peuvent être inaccessibles

## 🎉 Résultat

Après l'import, tu auras :
- ✅ Tous tes produits dans Payload CMS
- 🖼️ Images uploadées et liées
- 🏷️ Variantes configurées
- 📱 Interface admin pour gérer le tout
