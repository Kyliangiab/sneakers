/**
 * Tests unitaires pour le parcours d'achat complet
 * Couvre : calcul des totaux → vérification stock → création PaymentIntent → persistance commande
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculateCartTotal, validateCoupon, formatPrice } from '@/lib/cart/calculateTotal'
import { checkout, validateCheckoutParams } from '@/lib/checkout/checkoutService'
import * as stockService from '@/lib/inventory/checkAndReserveStock'
import * as stripeService from '@/lib/payments/stripeService'
import * as orderService from '@/lib/orders/persistOrder'
import type { CartItem, Coupon } from '@/lib/cart/calculateTotal'

// Mock des services externes
vi.mock('@/lib/inventory/checkAndReserveStock')
vi.mock('@/lib/payments/stripeService')
vi.mock('@/lib/orders/persistOrder')

describe('Parcours d\'achat complet (unit)', () => {
  // Données de test
  const mockItems: CartItem[] = [
    {
      id: 'item-1',
      productId: 'prod-1',
      title: 'Air Jordan 1 Retro High OG',
      brand: 'Air Jordan',
      price: 59.9,
      image: '/images/jordan-1.jpg',
      size: '42',
      color: 'Blanc',
      quantity: 1
    },
    {
      id: 'item-2',
      productId: 'prod-2',
      title: 'Nike Air Max 90 Essential',
      brand: 'Nike',
      price: 69.5,
      image: '/images/air-max-90.jpg',
      size: '43',
      color: 'Noir',
      quantity: 2
    }
  ]

  const mockCoupon: Coupon = {
    code: 'WELCOME10',
    type: 'fixed',
    value: 10,
    minAmount: 50
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Calcul des totaux', () => {
    it('calcule correctement le total avec TVA et sans coupon', () => {
      const result = calculateCartTotal(mockItems, {
        vatRate: 0.20,
        shippingCost: 9.99,
        freeShippingThreshold: 150
      })

      // Sous-total: 59.9 + (69.5 * 2) = 198.9
      expect(result.subtotal).toBeCloseTo(198.9, 2)
      
      // TVA: 198.9 * 0.20 = 39.78
      expect(result.vatAmount).toBeCloseTo(39.78, 2)
      
      // Livraison: 0 (car 198.9€ >= 150€)
      expect(result.shipping).toBe(0)
      
      // Total: 198.9 + 39.78 + 0 = 238.68
      expect(result.total).toBeCloseTo(238.68, 2)
    })

    it('calcule correctement le total avec coupon fixe', () => {
      const result = calculateCartTotal(mockItems, {
        vatRate: 0.20,
        shippingCost: 9.99,
        freeShippingThreshold: 150,
        coupon: mockCoupon
      })

      // Sous-total: 198.9
      expect(result.subtotal).toBeCloseTo(198.9, 2)
      
      // Remise: 10€
      expect(result.discount).toBe(10)
      
      // Total: 198.9 + 39.78 + 0 - 10 = 228.68
      expect(result.total).toBeCloseTo(228.68, 2)
    })

    it('calcule correctement le total avec coupon pourcentage', () => {
      const percentageCoupon: Coupon = {
        code: 'SAVE20',
        type: 'percentage',
        value: 20,
        maxDiscount: 50,
        minAmount: 100
      }

      const result = calculateCartTotal(mockItems, {
        vatRate: 0.20,
        shippingCost: 9.99,
        freeShippingThreshold: 150,
        coupon: percentageCoupon
      })

      // Remise: 198.9 * 0.20 = 39.78 (limitée à 50€)
      expect(result.discount).toBeCloseTo(39.78, 2)
    })

    it('applique la livraison gratuite au-dessus du seuil', () => {
      const expensiveItems: CartItem[] = [
        {
          id: 'item-1',
          productId: 'prod-1',
          title: 'Expensive Sneaker',
          brand: 'Luxury',
          price: 200,
          image: '/images/expensive.jpg',
          size: '42',
          color: 'Or',
          quantity: 1
        }
      ]

      const result = calculateCartTotal(expensiveItems, {
        vatRate: 0.20,
        shippingCost: 9.99,
        freeShippingThreshold: 150
      })

      // Livraison gratuite car 200€ >= 150€
      expect(result.shipping).toBe(0)
    })

    it('formate correctement les prix', () => {
      const formatted = formatPrice(123.45, 'eur')
      expect(formatted).toContain('123,45')
      expect(formatted).toContain('€')
    })
  })

  describe('Validation des coupons', () => {
    it('valide un coupon valide', () => {
      const result = validateCoupon(mockCoupon, 100)
      expect(result.valid).toBe(true)
    })

    it('rejette un coupon expiré', () => {
      const expiredCoupon: Coupon = {
        code: 'EXPIRED',
        type: 'fixed',
        value: 10,
        expiresAt: new Date('2023-01-01')
      }

      const result = validateCoupon(expiredCoupon, 100)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Coupon expiré')
    })

    it('rejette un coupon si montant insuffisant', () => {
      const result = validateCoupon(mockCoupon, 30)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Montant minimum de 50€ requis')
    })
  })

  describe('Processus de checkout complet', () => {
    it('exécute le parcours complet avec succès', async () => {
      // Mock des services
      vi.spyOn(stockService, 'checkAndReserveStock').mockResolvedValue(true)
      vi.spyOn(stripeService, 'createPaymentIntent').mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        status: 'requires_payment_method',
        amount: 23867, // 238.67€ en centimes
        currency: 'eur'
      })
      vi.spyOn(orderService, 'createOrder').mockResolvedValue({
        id: 'order_123',
        orderNumber: 'CMD-123',
        customerEmail: 'customer@example.com',
        items: [],
        subtotal: 198.9,
        shipping: 0,
        tax: 39.78,
        total: 228.68,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const result = await checkout({
        items: mockItems,
        customerEmail: 'customer@example.com',
        couponCode: 'WELCOME10',
        currency: 'eur',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      })

      expect(result.success).toBe(true)
      expect(result.clientSecret).toBe('pi_test_123_secret')
      expect(result.orderId).toBe('order_123')

      // Vérifier que les services ont été appelés avec les bons paramètres
      expect(stockService.checkAndReserveStock).toHaveBeenCalledWith([
        { productId: 'prod-1', size: '42', color: 'Blanc', quantity: 1 },
        { productId: 'prod-2', size: '43', color: 'Noir', quantity: 2 }
      ])

      expect(stripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: 22868, // 228.68€ en centimes
        currency: 'EUR',
        metadata: {
          customer_email: 'customer@example.com',
          order_items: '2'
        }
      })

      expect(orderService.createOrder).toHaveBeenCalledWith({
        customerEmail: 'customer@example.com',
        items: expect.arrayContaining([
          expect.objectContaining({
            productId: 'prod-1',
            title: 'Air Jordan 1 Retro High OG',
            price: 59.9,
            quantity: 1
          }),
          expect.objectContaining({
            productId: 'prod-2',
            title: 'Nike Air Max 90 Essential',
            price: 69.5,
            quantity: 2
          })
        ]),
        subtotal: 198.9,
        shipping: 0,
        tax: 39.78,
        total: 228.68,
        stripePaymentIntentId: 'pi_test_123',
        billingAddress: expect.any(Object)
      })
    })

    it('échoue si le stock est insuffisant', async () => {
      vi.spyOn(stockService, 'checkAndReserveStock').mockResolvedValue(false)

      const result = await checkout({
        items: mockItems,
        customerEmail: 'customer@example.com',
        currency: 'eur',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Stock insuffisant pour certains articles')
    })

    it('gère les erreurs de création de Payment Intent', async () => {
      vi.spyOn(stockService, 'checkAndReserveStock').mockResolvedValue(true)
      vi.spyOn(stripeService, 'createPaymentIntent').mockRejectedValue(new Error('Erreur Stripe'))

      const result = await checkout({
        items: mockItems,
        customerEmail: 'customer@example.com',
        currency: 'eur',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erreur Stripe')
    })

    it('gère les erreurs de persistance de commande', async () => {
      vi.spyOn(stockService, 'checkAndReserveStock').mockResolvedValue(true)
      vi.spyOn(stripeService, 'createPaymentIntent').mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        status: 'requires_payment_method',
        amount: 23867,
        currency: 'eur'
      })
      vi.spyOn(orderService, 'createOrder').mockRejectedValue(new Error('Erreur base de données'))

      const result = await checkout({
        items: mockItems,
        customerEmail: 'customer@example.com',
        currency: 'eur',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erreur base de données')
    })
  })

  describe('Validation des paramètres de checkout', () => {
    it('valide des paramètres corrects', () => {
      const params = {
        items: mockItems,
        customerEmail: 'customer@example.com',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      }

      const result = validateCheckoutParams(params)
      expect(result.valid).toBe(true)
    })

    it('rejette un panier vide', () => {
      const params = {
        items: [],
        customerEmail: 'customer@example.com',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      }

      const result = validateCheckoutParams(params)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Panier vide')
    })

    it('rejette un email manquant', () => {
      const params = {
        items: mockItems,
        customerEmail: '',
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      }

      const result = validateCheckoutParams(params)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Email client requis')
    })

    it('rejette une adresse de facturation manquante', () => {
      const params = {
        items: mockItems,
        customerEmail: 'customer@example.com'
      }

      const result = validateCheckoutParams(params)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Adresse de facturation requise')
    })
  })

  describe('Cas limites et arrondis', () => {
    it('gère correctement les prix avec décimales', () => {
      const itemsWithDecimals: CartItem[] = [
        {
          id: 'item-1',
          productId: 'prod-1',
          title: 'Sneaker avec décimales',
          brand: 'Test',
          price: 33.33,
          image: '/images/test.jpg',
          size: '42',
          color: 'Rouge',
          quantity: 3
        }
      ]

      const result = calculateCartTotal(itemsWithDecimals, {
        vatRate: 0.20,
        shippingCost: 9.99,
        freeShippingThreshold: 150
      })

      // Sous-total: 33.33 * 3 = 99.99
      expect(result.subtotal).toBeCloseTo(99.99, 2)
      
      // TVA: 99.99 * 0.20 = 19.998 → arrondi à 20.00
      expect(result.vatAmount).toBeCloseTo(20.00, 2)
      
      // Total: 99.99 + 20.00 + 9.99 = 129.98
      expect(result.total).toBeCloseTo(129.98, 2)
    })

    it('gère les coupons avec montant maximum', () => {
      const couponWithMax: Coupon = {
        code: 'SAVE50',
        type: 'percentage',
        value: 50, // 50% de remise
        maxDiscount: 30, // Maximum 30€ de remise
        minAmount: 100
      }

      const result = calculateCartTotal(mockItems, {
        vatRate: 0.20,
        shippingCost: 9.99,
        freeShippingThreshold: 150,
        coupon: couponWithMax
      })

      // Remise calculée: 198.9 * 0.50 = 99.45
      // Mais limitée à 30€ par maxDiscount
      expect(result.discount).toBe(30)
    })
  })
})
