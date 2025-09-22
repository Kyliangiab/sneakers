# 🧪 Cartes de Test Stripe - Mode Développement

## ⚠️ IMPORTANT - Mode Test

**Ce site utilise Stripe en MODE TEST. Aucun vrai paiement ne sera effectué !**

Toutes les transactions sont simulées et aucun argent ne sera débité de votre compte bancaire.

## 💳 Cartes de Test Disponibles

### ✅ Cartes de Succès

| Numéro de Carte | Type | Description | CVC | Expiration |
|-----------------|------|-------------|-----|------------|
| `4242 4242 4242 4242` | Visa | Paiement réussi | `123` | `12/34` |
| `5555 5555 5555 4444` | Mastercard | Paiement réussi | `123` | `12/34` |
| `3782 822463 10005` | American Express | Paiement réussi | `1234` | `12/34` |

### ❌ Cartes d'Échec

| Numéro de Carte | Type | Description | CVC | Expiration |
|-----------------|------|-------------|-----|------------|
| `4000 0000 0000 0002` | Visa | Paiement refusé | `123` | `12/34` |
| `4000 0000 0000 0069` | Visa | Carte expirée | `123` | `12/34` |
| `4000 0000 0000 0119` | Visa | Erreur de traitement | `123` | `12/34` |

### 🔐 Cartes 3D Secure

| Numéro de Carte | Type | Description | CVC | Expiration |
|-----------------|------|-------------|-----|------------|
| `4000 0025 0000 3155` | Visa | Authentification 3D Secure | `123` | `12/34` |
| `4000 0027 6000 3184` | Visa | 3D Secure - Échec | `123` | `12/34` |

## 🎯 Informations de Test

### Données de Facturation
- **Nom sur la carte** : `Test User` (ou n'importe quel nom)
- **Email** : `test@example.com` (ou n'importe quel email)
- **Adresse** : N'importe quelle adresse valide

### Codes de Réponse
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`
- **Expirée** : `4000 0000 0000 0069`

## 🛡️ Sécurité

### Clés Stripe Utilisées
```bash
# Clé publique (visible côté client)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef

# Clé secrète (côté serveur uniquement)
STRIPE_SECRET_KEY=sk_test_51234567890abcdef
```

### Vérification Mode Test
- ✅ Toutes les clés commencent par `pk_test_` et `sk_test_`
- ✅ Aucune transaction réelle ne sera effectuée
- ✅ Aucun argent ne sera débité
- ✅ Toutes les données sont simulées

## 🚀 Processus de Test

### 1. Ajout au Panier
1. Naviguez vers `/products`
2. Cliquez sur "Ajouter au panier" sur n'importe quel produit
3. Vérifiez que l'article apparaît dans le panier

### 2. Checkout
1. Cliquez sur "Commander maintenant" dans le panier
2. Remplissez le formulaire d'adresse
3. Utilisez une carte de test pour le paiement
4. Cliquez sur "Payer"

### 3. Confirmation
1. La commande sera confirmée automatiquement
2. Vous serez redirigé vers la page de confirmation
3. Un avertissement indiquera que c'est un test

## 🔧 Configuration Technique

### Variables d'Environnement
```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_51234567890abcdef
```

### APIs Utilisées
- **Payment Intent** : `/api/stripe/create-payment-intent`
- **Création Commande** : `/api/orders/create`
- **Confirmation Paiement** : `/api/orders/confirm-payment`

## 📱 Interface Utilisateur

### Avertissements Visuels
- 🟡 **Bandeau bleu** : Informations sur les cartes de test
- 🟡 **Bandeau jaune** : Avertissement mode test sur confirmation
- ✅ **Icônes** : Statuts visuels pour chaque type de carte

### Fonctionnalités
- 📋 **Copie rapide** : Boutons pour copier les numéros de carte
- 🔍 **Expansion** : Cartes de test pliables/dépliables
- 📱 **Responsive** : Interface adaptée mobile et desktop

## 🎯 Cas d'Usage de Test

### Scénario 1 : Paiement Réussi
1. Utilisez `4242 4242 4242 4242`
2. Remplissez CVC : `123`
3. Expiration : `12/34`
4. Résultat : Commande confirmée ✅

### Scénario 2 : Paiement Refusé
1. Utilisez `4000 0000 0000 0002`
2. Remplissez CVC : `123`
3. Expiration : `12/34`
4. Résultat : Erreur de paiement ❌

### Scénario 3 : 3D Secure
1. Utilisez `4000 0025 0000 3155`
2. Remplissez CVC : `123`
3. Expiration : `12/34`
4. Résultat : Authentification 3D Secure 🔐

## 🔄 Migration Production

### Pour Passer en Production
1. **Remplacer les clés** :
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

2. **Tester avec de vraies cartes** :
   - Utiliser des cartes de test Stripe en mode live
   - Commencer avec de petits montants

3. **Configurer les webhooks** :
   - URL : `https://votre-domaine.com/api/stripe/webhook`
   - Événements : `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📞 Support

### En Cas de Problème
1. **Vérifiez les clés** : Doivent commencer par `pk_test_` et `sk_test_`
2. **Console navigateur** : Regardez les erreurs JavaScript
3. **Logs serveur** : Vérifiez les logs de l'API
4. **Stripe Dashboard** : Consultez les logs de test

### Ressources
- [Documentation Stripe Test](https://stripe.com/docs/testing)
- [Cartes de Test Stripe](https://stripe.com/docs/testing#cards)
- [Webhooks Stripe](https://stripe.com/docs/webhooks)

---

**🎉 Profitez du test en toute sécurité ! Aucun vrai paiement ne sera effectué.** 🎉

