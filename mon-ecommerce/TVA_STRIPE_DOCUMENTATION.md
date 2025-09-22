# Configuration TVA Stripe

## 🧾 **TVA incluse dans les commandes**

La TVA française (20%) est maintenant automatiquement incluse dans toutes les commandes Stripe.

## ⚙️ **Configuration technique**

### **1. Calcul de la TVA**
- **Taux de TVA** : 20% (taux français standard)
- **Calcul** : `TVA = Sous-total × 0.20`
- **Arrondi** : 2 décimales

### **2. Stripe Checkout avec TVA automatique**
```javascript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: lineItems,
  automatic_tax: {
    enabled: true, // TVA automatique
  },
  tax_id_collection: {
    enabled: true, // Collecte du numéro de TVA intracommunautaire
  },
  // ...
})
```

### **3. Affichage dans l'interface**
- **Résumé de commande** : Sous-total + TVA + Total
- **Bouton de paiement** : Montant total avec TVA
- **Page de confirmation** : Détail des taxes

## 🧮 **Exemple de calcul**

```
Sous-total : 100,00 €
TVA (20%)  :  20,00 €
Livraison  :   0,00 € (gratuite)
─────────────────────
Total      : 120,00 €
```

## 🔧 **Configuration Stripe requise**

### **1. Activer la TVA automatique**
- Aller dans Stripe Dashboard > Settings > Tax
- Activer "Automatic tax calculation"
- Configurer les taux de TVA par pays

### **2. Taux de TVA configurés**
- **France** : 20% (TVA standard)
- **Autres pays UE** : Selon les taux locaux
- **Hors UE** : 0% (export)

## 🧪 **Test de la configuration**

```bash
# Exécuter le script de test
node test-stripe-tax.js
```

## 📋 **Vérifications**

### **1. Dans Stripe Dashboard**
- Vérifier que la TVA est calculée automatiquement
- Contrôler les montants dans les sessions de test
- Vérifier les reçus de paiement

### **2. Dans l'application**
- Le résumé de commande affiche la TVA
- Le bouton de paiement montre le bon montant
- La page de confirmation inclut les taxes

## 🚨 **Points d'attention**

1. **TVA intracommunautaire** : Collectée si l'utilisateur fournit un numéro de TVA
2. **Pays de livraison** : La TVA s'adapte automatiquement
3. **Export** : 0% de TVA pour les livraisons hors UE
4. **Conformité** : Respect des réglementations fiscales françaises

## 📞 **Support**

En cas de problème avec la TVA :
1. Vérifier la configuration Stripe
2. Tester avec des cartes de test
3. Consulter les logs de l'API
4. Vérifier les montants dans Stripe Dashboard
