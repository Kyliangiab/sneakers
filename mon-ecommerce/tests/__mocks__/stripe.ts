/**
 * Mocks pour les services Stripe
 * Utilisés dans les tests unitaires pour éviter les appels réseau réels
 */

export const mockStripeService = {
  createPaymentIntent: vi.fn(),
  createCheckoutSession: vi.fn(),
  getPaymentIntent: vi.fn()
}

// Mock par défaut pour createPaymentIntent
mockStripeService.createPaymentIntent.mockResolvedValue({
  id: 'pi_test_123456789',
  client_secret: 'pi_test_123456789_secret_abcdef',
  status: 'requires_payment_method',
  amount: 10000,
  currency: 'eur'
})

// Mock par défaut pour createCheckoutSession
mockStripeService.createCheckoutSession.mockResolvedValue({
  id: 'cs_test_123456789',
  url: 'https://checkout.stripe.com/pay/cs_test_123456789'
})

// Mock par défaut pour getPaymentIntent
mockStripeService.getPaymentIntent.mockResolvedValue({
  id: 'pi_test_123456789',
  client_secret: 'pi_test_123456789_secret_abcdef',
  status: 'succeeded',
  amount: 10000,
  currency: 'eur'
})

export default mockStripeService
