import { Access } from 'payload/types'

/**
 * Accès réservé uniquement aux administrateurs
 */
export const adminOnly: Access = ({ req: { user } }) => {
  // Si l'utilisateur est connecté et a le rôle 'admin'
  if (user && user.role === 'admin') {
    return true
  }
  
  // Sinon, refuser l'accès
  return false
}
