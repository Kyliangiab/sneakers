import { Access } from 'payload/types'

/**
 * Accès pour les administrateurs et vendeurs
 */
export const adminOrVendeur: Access = ({ req: { user } }) => {
  // Si l'utilisateur est connecté et a le rôle 'admin' ou 'vendeur'
  if (user && (user.role === 'admin' || user.role === 'vendeur')) {
    return true
  }
  
  // Sinon, refuser l'accès
  return false
}
