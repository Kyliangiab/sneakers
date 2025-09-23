/**
 * Utilitaires de calcul pour le panier
 * Gère les calculs de totaux, TVA, remises et coupons
 */

export interface CartItem {
  id: string
  productId: string
  title: string
  brand: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minAmount?: number
  maxDiscount?: number
  expiresAt?: Date
}

export interface CartCalculation {
  subtotal: number
  vatRate: number
  vatAmount: number
  shipping: number
  discount: number
  total: number
  currency: string
}

export interface CartCalculationOptions {
  vatRate?: number
  shippingCost?: number
  freeShippingThreshold?: number
  coupon?: Coupon
  currency?: string
}

/**
 * Calcule le total du panier avec TVA, livraison et coupons
 */
export function calculateCartTotal(
  items: CartItem[],
  options: CartCalculationOptions = {}
): CartCalculation {
  const {
    vatRate = 0.20, // TVA française 20%
    shippingCost = 9.99,
    freeShippingThreshold = 150,
    coupon,
    currency = 'eur'
  } = options

  // Calcul du sous-total
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Calcul de la TVA
  const vatAmount = Math.round(subtotal * vatRate * 100) / 100

  // Calcul de la livraison
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost

  // Calcul de la remise
  let discount = 0
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = Math.round(subtotal * (coupon.value / 100) * 100) / 100
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
    } else {
      discount = Math.min(coupon.value, subtotal)
    }
    
    // Vérifier le montant minimum pour le coupon
    if (coupon.minAmount && subtotal < coupon.minAmount) {
      discount = 0
    }
  }

  // Calcul du total final
  const total = Math.round((subtotal + vatAmount + shipping - discount) * 100) / 100

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatRate,
    vatAmount,
    shipping,
    discount,
    total,
    currency
  }
}

/**
 * Valide un coupon
 */
export function validateCoupon(coupon: Coupon, subtotal: number): { valid: boolean; error?: string } {
  // Vérifier l'expiration
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { valid: false, error: 'Coupon expiré' }
  }

  // Vérifier le montant minimum
  if (coupon.minAmount && subtotal < coupon.minAmount) {
    return { valid: false, error: `Montant minimum de ${coupon.minAmount}€ requis` }
  }

  return { valid: true }
}

/**
 * Formate un montant en euros
 */
export function formatPrice(amount: number, currency: string = 'eur'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount)
}
