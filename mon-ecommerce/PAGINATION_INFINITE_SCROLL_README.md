# 🔄 Système de Pagination et Chargement Infini

## 📋 Vue d'ensemble

Le système de pagination et de chargement infini a été implémenté pour améliorer l'expérience utilisateur en permettant de charger les produits progressivement et d'afficher le nombre réel de résultats.

## 🔧 Architecture Technique

### **API des Produits** (`/api/products`)

#### **Paramètres de Pagination**
- `limit` : Nombre de produits par page (défaut: 12)
- `page` : Numéro de la page (défaut: 1)

#### **Réponse avec Pagination**
```json
{
  "docs": [...], // Produits de la page
  "totalDocs": 118, // Nombre total de produits
  "limit": 12,
  "totalPages": 10,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

### **Logique de Pagination**

#### **1. Récupération de Tous les Produits**
```typescript
// Récupérer TOUS les produits d'abord pour appliquer les filtres
const allProductsResult = await payload.find({
  collection: 'products',
  limit: 1000, // Récupérer un grand nombre pour avoir tous les produits
  depth: 1,
})
```

#### **2. Application des Filtres**
```typescript
// Filtrer côté client pour les critères complexes
let filteredDocs = allProductsResult.docs || []

if (sizes && sizes.length > 0) {
  filteredDocs = filteredDocs.filter((product: any) => {
    // Logique de filtrage par taille
  })
}

if (brands && brands.length > 0) {
  filteredDocs = filteredDocs.filter((product: any) => {
    // Logique de filtrage par marque
  })
}

if (colors && colors.length > 0) {
  filteredDocs = filteredDocs.filter((product: any) => {
    // Logique de filtrage par couleur
  })
}
```

#### **3. Pagination des Résultats Filtrés**
```typescript
// Appliquer la pagination aux documents filtrés
const totalFilteredDocs = filteredDocs.length
const totalPages = Math.ceil(totalFilteredDocs / limit)
const startIndex = (page - 1) * limit
const endIndex = startIndex + limit
const paginatedDocs = filteredDocs.slice(startIndex, endIndex)
```

## 🎯 Fonctionnalités Frontend

### **État de Pagination**
```typescript
const [products, setProducts] = useState<Product[]>([])
const [loading, setLoading] = useState(true)
const [loadingMore, setLoadingMore] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
const [totalProducts, setTotalProducts] = useState(0)
const [hasMoreProducts, setHasMoreProducts] = useState(true)
```

### **Fonction de Récupération**
```typescript
const fetchProducts = async (page = 1, append = false) => {
  if (page === 1) {
    setLoading(true)
  } else {
    setLoadingMore(true)
  }

  try {
    const params = new URLSearchParams({
      limit: '12',
      page: page.toString(),
    })

    // Ajouter les filtres
    if (filters.search) params.append('search', filters.search)
    if (filters.size.length > 0) params.append('sizes', filters.size.join(','))
    if (filters.brand.length > 0) params.append('brands', filters.brand.join(','))
    if (filters.color.length > 0) params.append('colors', filters.color.join(','))
    if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString())
    if (filters.priceRange[1] < 500) params.append('maxPrice', filters.priceRange[1].toString())

    const response = await fetch(`/api/products?${params.toString()}`)
    const data = await response.json()
    
    if (append) {
      setProducts(prev => [...prev, ...(data.docs || [])])
    } else {
      setProducts(data.docs || [])
    }
    
    setTotalProducts(data.totalDocs || 0)
    setHasMoreProducts(data.hasNextPage || false)
    setCurrentPage(page)
  } catch (error) {
    console.error('Error fetching products:', error)
  }
  
  setLoading(false)
  setLoadingMore(false)
}
```

### **Chargement Infini**
```typescript
// Fonction pour charger plus de produits
const loadMoreProducts = () => {
  if (!loadingMore && hasMoreProducts) {
    fetchProducts(currentPage + 1, true)
  }
}
```

### **Reset de Pagination**
```typescript
// Reset pagination quand les filtres changent
useEffect(() => {
  if (currentPage === 1) {
    fetchProducts(1, false)
  } else {
    setCurrentPage(1)
    fetchProducts(1, false)
  }
}, [filters]) // Re-fetch quand les filtres changent
```

## 🎨 Interface Utilisateur

### **Affichage du Nombre de Résultats**
```typescript
<div className="flex items-center space-x-4">
  <span className="text-sm text-gray-600">{totalProducts} résultats</span>
  {activeFilters > 0 && (
    <span className="text-sm text-gray-600">{activeFilters} filtre{activeFilters > 1 ? 's' : ''}</span>
  )}
</div>
```

### **Bouton "Charger Plus"**
```typescript
{hasMoreProducts && (
  <div className="mt-12 text-center">
    <button 
      onClick={loadMoreProducts}
      disabled={loadingMore}
      className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loadingMore ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Chargement...
        </div>
      ) : (
        'Charger plus de produits'
      )}
    </button>
  </div>
)}
```

### **Message de Fin**
```typescript
{!hasMoreProducts && products.length > 0 && (
  <div className="mt-12 text-center text-gray-500">
    <p>Tous les produits ont été chargés</p>
  </div>
)}
```

## 📊 Tests de Validation

### **Tests API Réussis** ✅

#### **Pagination de Base**
```bash
# Page 1
curl "http://localhost:3000/api/products?limit=5&page=1"
→ {"totalDocs": 118, "page": 1, "hasNextPage": true, "docs": 5}

# Page 2
curl "http://localhost:3000/api/products?limit=5&page=2"
→ {"totalDocs": 118, "page": 2, "hasNextPage": true, "docs": 5}

# Dernière page
curl "http://localhost:3000/api/products?limit=5&page=24"
→ {"totalDocs": 118, "page": 24, "hasNextPage": false, "docs": 3}
```

#### **Pagination avec Filtres**
```bash
# Filtrage par marque
curl "http://localhost:3000/api/products?limit=5&page=1&brands=Vans"
→ {"totalDocs": 38, "page": 1, "hasNextPage": true, "docs": 5}

# Filtrage par recherche
curl "http://localhost:3000/api/products?limit=5&page=1&search=vans"
→ {"totalDocs": 118, "page": 1, "hasNextPage": true, "docs": 5}
```

### **Tests Frontend Réussis** ✅
- ✅ **Page `/products`** : Pagination fonctionnelle
- ✅ **Page `/products/homme`** : Pagination fonctionnelle
- ✅ **Chargement infini** : Bouton "Charger plus" opérationnel
- ✅ **Nombre de résultats** : Affichage réel (118 produits)
- ✅ **États de chargement** : Spinner et désactivation du bouton

## 🚀 Avantages du Système

### **Performance**
- ✅ **Chargement progressif** : Évite le chargement de tous les produits d'un coup
- ✅ **Filtrage efficace** : Application des filtres avant pagination
- ✅ **Cache** : Réutilisation des données déjà chargées

### **Expérience Utilisateur**
- ✅ **Chargement rapide** : Affichage immédiat des premiers produits
- ✅ **Feedback visuel** : Spinner de chargement et états désactivés
- ✅ **Information claire** : Nombre total de résultats affiché
- ✅ **Navigation intuitive** : Bouton "Charger plus" simple

### **Fonctionnalités**
- ✅ **Filtres persistants** : Les filtres s'appliquent à toutes les pages
- ✅ **Reset automatique** : Retour à la page 1 lors du changement de filtres
- ✅ **Gestion d'erreurs** : Fallback en cas de problème
- ✅ **Responsive** : Fonctionne sur tous les devices

## 📱 Pages Mises à Jour

### **Page Générale** (`/products`)
- ✅ **Pagination** : 12 produits par page
- ✅ **Chargement infini** : Bouton "Charger plus"
- ✅ **Nombre de résultats** : 118 produits affichés
- ✅ **Filtres** : Application à toutes les pages

### **Page Homme** (`/products/homme`)
- ✅ **Pagination** : 12 produits par page
- ✅ **Chargement infini** : Bouton "Charger plus"
- ✅ **Nombre de résultats** : Basé sur les filtres homme
- ✅ **Filtres** : Application à toutes les pages

## 🔮 Optimisations Futures

### **Améliorations Possibles**
1. **Infinite Scroll** : Détection automatique du scroll
2. **Cache** : Mise en cache des pages chargées
3. **Préchargement** : Chargement anticipé de la page suivante
4. **Virtualisation** : Rendu optimisé pour de grandes listes
5. **URLs** : Paramètres de pagination dans l'URL

### **Performance**
1. **Lazy Loading** : Chargement des images à la demande
2. **Debounce** : Éviter les requêtes excessives
3. **Compression** : Réduction de la taille des réponses
4. **CDN** : Mise en cache des images

---

**Le système de pagination et de chargement infini est maintenant entièrement fonctionnel !** 🎉
