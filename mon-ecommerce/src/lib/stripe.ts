import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Clés Stripe en mode test
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef'
const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef'

// Instance Stripe côté serveur
export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-08-27.basil',
})

// Instance Stripe côté client
export const stripePromise = loadStripe(publishableKey)

// Configuration Stripe
export const stripeConfig = {
  publishableKey,
  currency: 'eur',
  country: 'FR',
  locale: 'fr',
}
