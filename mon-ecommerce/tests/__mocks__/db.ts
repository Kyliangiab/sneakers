/**
 * Mocks pour les services de base de données (Payload CMS)
 * Utilisés dans les tests unitaires pour éviter les appels réseau réels
 */

export const mockDbService = {
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
  getOrderById: vi.fn(),
  getOrdersByCustomer: vi.fn(),
  checkAndReserveStock: vi.fn(),
  getCoupon: vi.fn()
}

// Mock par défaut pour createOrder
mockDbService.createOrder.mockResolvedValue({
  id: 'order_123456789',
  orderNumber: 'CMD-123456789-ABC123',
  customerEmail: 'customer@example.com',
  customerId: 'user_123',
  items: [],
  subtotal: 100,
  shipping: 9.99,
  tax: 20,
  total: 129.99,
  status: 'pending',
  stripePaymentIntentId: 'pi_test_123456789',
  createdAt: new Date(),
  updatedAt: new Date()
})

// Mock par défaut pour updateOrderStatus
mockDbService.updateOrderStatus.mockResolvedValue({
  id: 'order_123456789',
  orderNumber: 'CMD-123456789-ABC123',
  customerEmail: 'customer@example.com',
  items: [],
  subtotal: 100,
  shipping: 9.99,
  tax: 20,
  total: 129.99,
  status: 'paid',
  createdAt: new Date(),
  updatedAt: new Date()
})

// Mock par défaut pour getOrderById
mockDbService.getOrderById.mockResolvedValue({
  id: 'order_123456789',
  orderNumber: 'CMD-123456789-ABC123',
  customerEmail: 'customer@example.com',
  items: [],
  subtotal: 100,
  shipping: 9.99,
  tax: 20,
  total: 129.99,
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date()
})

// Mock par défaut pour getOrdersByCustomer
mockDbService.getOrdersByCustomer.mockResolvedValue([])

// Mock par défaut pour checkAndReserveStock
mockDbService.checkAndReserveStock.mockResolvedValue(true)

// Mock par défaut pour getCoupon
mockDbService.getCoupon.mockResolvedValue({
  code: 'WELCOME10',
  type: 'fixed',
  value: 10,
  minAmount: 50
})

export default mockDbService
