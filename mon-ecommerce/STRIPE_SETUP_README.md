# Configuration Stripe

## Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Stripe (Mode test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Configuration du webhook en local

1. Installez la CLI Stripe :
```bash
npm install -g @stripe/stripe-cli
```

2. Connectez-vous à votre compte Stripe :
```bash
stripe login
```

3. Démarrez le webhook en local :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copiez le secret du webhook affiché dans la console et ajoutez-le à votre `.env.local`

## Cartes de test Stripe

Utilisez ces cartes pour tester les paiements :

- **Visa** : 4242 4242 4242 4242
- **Visa (débit)** : 4000 0566 5566 5556
- **Mastercard** : 5555 5555 5555 4444
- **American Express** : 3782 822463 10005

**Informations communes :**
- Date d'expiration : n'importe quelle date future
- CVC : n'importe quel code à 3 chiffres
- Code postal : n'importe quel code postal valide

## Endpoints créés

- `POST /api/stripe/create-checkout-session` - Crée une session de paiement Stripe
- `POST /api/stripe/webhook` - Webhook pour gérer les événements de paiement
- `GET /api/orders/[id]` - Récupère les détails d'une commande

## Flux de paiement

1. L'utilisateur remplit le formulaire de checkout
2. Une session Stripe Checkout est créée avec les articles du panier
3. L'utilisateur est redirigé vers Stripe pour le paiement
4. Après paiement, redirection vers `/order-confirmation?orderId=...`
5. Le webhook Stripe met à jour le statut de la commande

## Statuts de commande

- `REQUIRES_PAYMENT` - En attente de paiement
- `PAID` - Paiement confirmé
- `FAILED` - Échec de paiement
- `cancelled` - Commande annulée
