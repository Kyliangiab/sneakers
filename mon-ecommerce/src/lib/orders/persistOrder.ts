/**
 * Service de persistance des commandes
 * Gère la création et la mise à jour des commandes dans Payload CMS
 */

export interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerEmail: string
  customerId?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  stripePaymentIntentId?: string
  stripeCheckoutSessionId?: string
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
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderParams {
  customerEmail: string
  customerId?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  stripePaymentIntentId?: string
  stripeCheckoutSessionId?: string
  billingAddress?: Order['billingAddress']
  shippingAddress?: Order['shippingAddress']
}

/**
 * Crée une nouvelle commande dans Payload CMS
 * Cette fonction simule l'appel à l'API Payload
 */
export async function createOrder(params: CreateOrderParams): Promise<Order> {
  try {
    // Simulation d'un appel à l'API Payload
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      customerEmail: params.customerEmail,
      customerId: params.customerId,
      items: params.items,
      subtotal: params.subtotal,
      shipping: params.shipping,
      tax: params.tax,
      total: params.total,
      status: 'pending',
      stripePaymentIntentId: params.stripePaymentIntentId,
      stripeCheckoutSessionId: params.stripeCheckoutSessionId,
      billingAddress: params.billingAddress,
      shippingAddress: params.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log(`Commande créée: ${order.orderNumber} - ${params.customerEmail} - ${params.total}€`)
    
    return order
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    throw new Error('Impossible de créer la commande')
  }
}

/**
 * Met à jour le statut d'une commande
 * Cette fonction simule l'appel à l'API Payload
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  try {
    // Simulation d'un appel à l'API Payload
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Simulation d'une commande trouvée et mise à jour
    const order: Order = {
      id: orderId,
      orderNumber: `CMD-${orderId}`,
      customerEmail: 'customer@example.com',
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log(`Statut de commande mis à jour: ${orderId} -> ${status}`)
    
    return order
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return null
  }
}

/**
 * Récupère une commande par son ID
 * Cette fonction simule l'appel à l'API Payload
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    // Simulation d'un appel à l'API Payload
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Simulation d'une commande trouvée
    const order: Order = {
      id: orderId,
      orderNumber: `CMD-${orderId}`,
      customerEmail: 'customer@example.com',
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return order
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return null
  }
}

/**
 * Récupère les commandes d'un client
 * Cette fonction simule l'appel à l'API Payload
 */
export async function getOrdersByCustomer(customerEmail: string): Promise<Order[]> {
  try {
    // Simulation d'un appel à l'API Payload
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Simulation de commandes trouvées
    const orders: Order[] = []
    
    return orders
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return []
  }
}
