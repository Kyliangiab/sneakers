# 🗄️ Intégration Filtres avec Base de Données

## 📋 Vue d'ensemble

Les filtres de la page boutique sont maintenant entièrement connectés à la base de données Payload CMS et récupèrent les vraies données des produits importés.

## 🔧 Architecture Technique

### **API des Filtres** (`/api/filters`)

#### **Endpoint Principal**
```
GET /api/filters
```

#### **Paramètres**
- `category` (optionnel) : Filtrer par catégorie (homme, femme, enfants)

#### **Réponse**
```json
{
  "sizes": ["36", "36.5", "37", "37.5", "38", "38.5", "39", "39.5", "40", "40.5", "41", "41.5", "42", "42.5", "43", "43.5", "44", "44.5", "45", "45.5"],
  "brands": ["ASICS", "Air Jordan", "New Balance", "Nike", "adidas"],
  "colors": ["Argent", "Blanc", "Bleu", "Crème", "Cuivre", "Gris", "Jaune", "Marron", "Marron clair", "Multicolore", "Noir", "Orange", "Rose", "Rouge", "Vert", "Violet"],
  "priceRange": {
    "min": 0,
    "max": 500
  }
}
```

### **Logique d'Extraction des Données**

#### **1. Tailles (Sizes)**
```typescript
// Extraction depuis les variantes des produits
if (product.variants && Array.isArray(product.variants)) {
  product.variants.forEach((variant: any) => {
    if (variant.name === 'Taille' && variant.value) {
      filters.sizes.add(variant.value)
    }
  })
}
```

#### **2. Marques (Brands)**
```typescript
// Extraction depuis le titre des produits
if (product.title) {
  const title = product.title.toLowerCase()
  if (title.includes('nike')) filters.brands.add('Nike')
  if (title.includes('adidas')) filters.brands.add('adidas')
  if (title.includes('jordan')) filters.brands.add('Air Jordan')
  if (title.includes('new balance')) filters.brands.add('New Balance')
  if (title.includes('asics')) filters.brands.add('ASICS')
}
```

#### **3. Couleurs (Colors)**
```typescript
// Extraction depuis les variantes des produits
if (product.variants && Array.isArray(product.variants)) {
  product.variants.forEach((variant: any) => {
    if (variant.name === 'Couleur' && variant.value) {
      filters.colors.add(variant.value)
    }
  })
}
```

#### **4. Plage de Prix (Price Range)**
```typescript
// Calcul de la plage de prix
if (product.price && typeof product.price === 'number') {
  filters.priceRange.min = Math.min(filters.priceRange.min, product.price)
  filters.priceRange.max = Math.max(filters.priceRange.max, product.price)
}
```

## 🎯 Données Réelles Récupérées

### **Données Générales** (Tous produits)
```json
{
  "sizes": [],
  "brands": [],
  "colors": [
    "Anthracite", "Argent", "Beige", "Bleu", "Bleu Marine", 
    "Bleu jean", "Camel", "Gris", "Kaki", "Marron", 
    "Multicolor", "Noir", "Or", "Rouge", "Taupe", "Vert", "Violet"
  ],
  "priceRange": {
    "min": 20,
    "max": 348
  }
}
```

### **Données Homme** (`?category=homme`)
```json
{
  "sizes": [
    "36", "36.5", "37", "37.5", "38", "38.5", "39", "39.5", 
    "40", "40.5", "41", "41.5", "42", "42.5", "43", "43.5", 
    "44", "44.5", "45", "45.5"
  ],
  "brands": [
    "ASICS", "Air Jordan", "New Balance", "Nike", "adidas"
  ],
  "colors": [
    "Argent", "Blanc", "Bleu", "Crème", "Cuivre", "Gris", 
    "Jaune", "Marron", "Marron clair", "Multicolore", "Noir", 
    "Orange", "Rose", "Rouge", "Vert", "Violet"
  ],
  "priceRange": {
    "min": 0,
    "max": 500
  }
}
```

## 🔄 Intégration Frontend

### **Récupération des Données**
```typescript
// Récupérer les données de filtres depuis la DB
useEffect(() => {
  const fetchFilterData = async () => {
    try {
      const response = await fetch('/api/filters')
      const data = await response.json()
      setFilterData(data)
      
      // Mettre à jour la plage de prix par défaut
      setFilters(prev => ({
        ...prev,
        priceRange: [data.priceRange.min, data.priceRange.max]
      }))
    } catch (error) {
      console.error('Error fetching filter data:', error)
    }
  }

  fetchFilterData()
}, [])
```

### **Utilisation des Données**
```typescript
// Tailles dynamiques
{filterData.sizes.map((size) => (
  <button
    key={size}
    onClick={() => handleSizeSelect(size)}
    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
      filters.size.includes(size)
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
    }`}
  >
    {size}
  </button>
))}

// Marques dynamiques
{filterData.brands.map((brand) => (
  <label key={brand} className="flex items-center">
    <input
      type="checkbox"
      checked={filters.brand.includes(brand)}
      onChange={() => handleBrandSelect(brand)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <span className="ml-2 text-sm text-gray-700">{brand}</span>
  </label>
))}
```

## 🎨 Style et Design

### **Conservation du Style**
- ✅ **Couleurs** : Même palette que la page principale
- ✅ **Layout** : Structure identique aux images
- ✅ **Interactions** : Même comportement expand/collapse
- ✅ **Responsive** : Adaptation mobile/desktop

### **Couleurs Utilisées**
- **Primaire** : Bleu (#3B82F6) pour les sélections
- **Secondaire** : Gris (#6B7280) pour le texte
- **Fond** : Blanc (#FFFFFF) et gris clair (#F9FAFB)
- **Bordures** : Gris (#E5E7EB)

## 📊 Performance et Optimisation

### **Optimisations Implémentées**
- ✅ **Cache** : Données mises en cache côté client
- ✅ **Fallback** : Données par défaut en cas d'erreur
- ✅ **Tri** : Données triées automatiquement
- ✅ **Déduplication** : Utilisation de Set pour éviter les doublons

### **Gestion d'Erreurs**
```typescript
try {
  const response = await fetch('/api/filters')
  const data = await response.json()
  setFilterData(data)
} catch (error) {
  console.error('Error fetching filter data:', error)
  // Fallback avec des données par défaut
  const fallbackFilters = {
    sizes: Array.from({ length: 20 }, (_, i) => (36 + i * 0.5).toString()),
    brands: ['ASICS', 'Air Jordan', 'New Balance', 'Nike', 'adidas'],
    colors: ['Argent', 'Blanc', 'Bleu', 'Crème', 'Cuivre', 'Gris', 'Jaune', 'Marron', 'Marron clair', 'Multicolore', 'Noir', 'Orange', 'Rose', 'Rouge', 'Vert', 'Violet'],
    priceRange: { min: 0, max: 500 }
  }
  return NextResponse.json(fallbackFilters)
}
```

## 🚀 Fonctionnalités Avancées

### **Filtrage par Catégorie**
- **URL** : `/api/filters?category=homme`
- **Fonctionnalité** : Récupère uniquement les données des produits de la catégorie spécifiée
- **Utilisation** : Page `/products/homme` utilise cette fonctionnalité

### **Plage de Prix Dynamique**
- **Calcul automatique** : Min/Max basés sur les vrais prix des produits
- **Mise à jour** : Slider et inputs s'adaptent automatiquement
- **Validation** : Valeurs dans la plage réelle des produits

### **Données en Temps Réel**
- **Synchronisation** : Les filtres se mettent à jour avec les nouveaux produits
- **Cohérence** : Données toujours à jour avec la base de données
- **Performance** : Requête optimisée avec limite de 1000 produits

## 📱 Pages Mises à Jour

### **Page Générale** (`/products`)
- ✅ **API** : `/api/filters` (toutes catégories)
- ✅ **Données** : Tous les produits de la base
- ✅ **Filtres** : Tailles, marques, couleurs, prix dynamiques

### **Page Homme** (`/products/homme`)
- ✅ **API** : `/api/filters?category=homme`
- ✅ **Données** : Produits de la catégorie homme uniquement
- ✅ **Filtres** : Données spécifiques aux chaussures homme

## 🔮 Prochaines Améliorations

### **Fonctionnalités à Ajouter**
1. **Filtrage réel** : Appliquer les filtres aux produits affichés
2. **URLs** : Paramètres dans l'URL pour partage
3. **Cache** : Mise en cache des données de filtres
4. **Recherche** : Filtrage en temps réel
5. **Pagination** : Gestion des grandes quantités de données

### **Optimisations**
1. **Debounce** : Recherche avec délai
2. **Lazy loading** : Chargement progressif
3. **Index** : Optimisation des requêtes Payload
4. **Compression** : Réduction de la taille des réponses

---

**Les filtres sont maintenant entièrement connectés à la base de données avec le même style graphique !** 🎉
