/**
 * Service principal de checkout
 * Orchestre le processus complet de commande
 */

import { calculateCartTotal, CartItem, Coupon } from '../cart/calculateTotal'
import { checkAndReserveStock, StockItem } from '../inventory/checkAndReserveStock'
import { createPaymentIntent, CreatePaymentIntentParams } from '../payments/stripeService'
import { createOrder, CreateOrderParams } from '../orders/persistOrder'

export interface CheckoutParams {
  items: CartItem[]
  customerEmail: string
  customerId?: string
  couponCode?: string
  currency?: string
  billingAddress?: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  shippingAddress?: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
  }
}

export interface CheckoutResult {
  success: boolean
  clientSecret?: string
  orderId?: string
  error?: string
}

/**
 * Processus complet de checkout
 * 1. Calcule les totaux
 * 2. Vérifie et réserve le stock
 * 3. Crée un Payment Intent Stripe
 * 4. Persiste la commande
 */
export async function checkout(params: CheckoutParams): Promise<CheckoutResult> {
  try {
    const { items, customerEmail, customerId, couponCode, currency = 'eur', billingAddress, shippingAddress } = params

    // 1. Calculer les totaux
    const coupon = couponCode ? await getCoupon(couponCode) : undefined
    const calculation = calculateCartTotal(items, {
      vatRate: 0.20, // TVA française 20%
      shippingCost: 9.99,
      freeShippingThreshold: 150,
      coupon,
      currency
    })

    // 2. Vérifier et réserver le stock
    const stockItems: StockItem[] = items.map(item => ({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: item.quantity
    }))

    const stockAvailable = await checkAndReserveStock(stockItems)
    if (!stockAvailable) {
      return {
        success: false,
        error: 'Stock insuffisant pour certains articles'
      }
    }

    // 3. Créer un Payment Intent Stripe
    const paymentIntentParams: CreatePaymentIntentParams = {
      amount: Math.round(calculation.total * 100), // Convertir en centimes
      currency: currency.toUpperCase(),
      metadata: {
        customer_email: customerEmail,
        order_items: items.length.toString()
      }
    }

    const paymentIntent = await createPaymentIntent(paymentIntentParams)

    // 4. Persister la commande
    const orderParams: CreateOrderParams = {
      customerEmail,
      customerId,
      items: items.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      subtotal: calculation.subtotal,
      shipping: calculation.shipping,
      tax: calculation.vatAmount,
      total: calculation.total,
      stripePaymentIntentId: paymentIntent.id,
      billingAddress,
      shippingAddress
    }

    const order = await createOrder(orderParams)

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    }

  } catch (error) {
    console.error('Erreur lors du checkout:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors du checkout'
    }
  }
}

/**
 * Récupère un coupon par son code
 * Cette fonction simule l'appel à la base de données
 */
async function getCoupon(code: string): Promise<Coupon | null> {
  try {
    // Simulation d'un appel à la base de données
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Simulation de coupons disponibles
    const mockCoupons: Record<string, Coupon> = {
      'WELCOME10': {
        code: 'WELCOME10',
        type: 'fixed',
        value: 10,
        minAmount: 50
      },
      'SAVE20': {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        maxDiscount: 50,
        minAmount: 100
      },
      'EXPIRED': {
        code: 'EXPIRED',
        type: 'fixed',
        value: 5,
        expiresAt: new Date('2023-01-01')
      }
    }

    return mockCoupons[code] || null
  } catch (error) {
    console.error('Erreur lors de la récupération du coupon:', error)
    return null
  }
}

/**
 * Valide les paramètres de checkout
 */
export function validateCheckoutParams(params: CheckoutParams): { valid: boolean; error?: string } {
  if (!params.items || params.items.length === 0) {
    return { valid: false, error: 'Panier vide' }
  }

  if (!params.customerEmail) {
    return { valid: false, error: 'Email client requis' }
  }

  if (!params.billingAddress) {
    return { valid: false, error: 'Adresse de facturation requise' }
  }

  return { valid: true }
}
