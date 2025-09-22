import { Access } from 'payload/types'

/**
 * Accès pour tous les utilisateurs authentifiés
 */
export const authenticated: Access = ({ req: { user } }) => {
  // Si l'utilisateur est connecté
  if (user) {
    return true
  }
  
  // Sinon, refuser l'accès
  return false
}