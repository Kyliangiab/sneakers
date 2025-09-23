/**
 * Service de gestion des stocks
 * Vérifie et réserve le stock pour les articles du panier
 */

export interface StockItem {
  productId: string
  size: string
  color: string
  quantity: number
}

export interface StockCheckResult {
  available: boolean
  reserved: boolean
  items: Array<{
    productId: string
    size: string
    color: string
    requested: number
    available: number
    reserved: boolean
  }>
}

/**
 * Vérifie et réserve le stock pour les articles du panier
 * Cette fonction simule l'appel à la base de données Payload
 */
export async function checkAndReserveStock(items: StockItem[]): Promise<boolean> {
  try {
    // Simulation de la vérification du stock
    // En réalité, ceci ferait un appel à Payload CMS
    const stockResults = await Promise.all(
      items.map(async (item) => {
        // Simulation d'un appel API à Payload
        const availableStock = await getAvailableStock(item.productId, item.size, item.color)
        
        if (availableStock < item.quantity) {
          return {
            productId: item.productId,
            size: item.size,
            color: item.color,
            requested: item.quantity,
            available: availableStock,
            reserved: false
          }
        }

        // Réserver le stock
        await reserveStock(item.productId, item.size, item.color, item.quantity)
        
        return {
          productId: item.productId,
          size: item.size,
          color: item.color,
          requested: item.quantity,
          available: availableStock,
          reserved: true
        }
      })
    )

    // Vérifier si tous les articles ont pu être réservés
    const allReserved = stockResults.every(result => result.reserved)
    
    if (!allReserved) {
      // Annuler les réservations déjà effectuées
      await cancelReservations(stockResults.filter(r => r.reserved))
    }

    return allReserved
  } catch (error) {
    console.error('Erreur lors de la vérification du stock:', error)
    return false
  }
}

/**
 * Récupère le stock disponible pour un produit
 * Simulation d'un appel à Payload CMS
 */
async function getAvailableStock(productId: string, size: string, color: string): Promise<number> {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 10))
  
  // Simulation de données de stock
  // En réalité, ceci ferait un appel à Payload CMS
  const mockStock = Math.floor(Math.random() * 20) + 1 // 1-20 en stock
  
  return mockStock
}

/**
 * Réserve du stock pour un produit
 * Simulation d'un appel à Payload CMS
 */
async function reserveStock(productId: string, size: string, color: string, quantity: number): Promise<void> {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 5))
  
  // En réalité, ceci ferait un appel à Payload CMS pour mettre à jour le stock
  console.log(`Stock réservé: ${productId} (${size}, ${color}) - ${quantity} unités`)
}

/**
 * Annule les réservations de stock
 * Simulation d'un appel à Payload CMS
 */
async function cancelReservations(reservations: Array<{ productId: string; size: string; color: string; requested: number }>): Promise<void> {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 5))
  
  // En réalité, ceci ferait des appels à Payload CMS pour libérer le stock
  console.log(`Réservations annulées: ${reservations.length} articles`)
}
