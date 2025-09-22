import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminOnly } from '../../access/adminOnly'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => {
      // Permettre l'accès au panneau d'administration pour les admins et vendeurs
      if (user && (user.role === 'admin' || user.role === 'vendeur')) {
        return true
      }
      return false
    },
    create: () => true, // Permettre la création pour l'inscription
    delete: adminOnly, // Seuls les admins peuvent supprimer des utilisateurs
    read: adminOnly, // Seuls les admins peuvent voir la liste des utilisateurs
    update: adminOnly, // Seuls les admins peuvent modifier les utilisateurs
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Client',
          value: 'client',
        },
        {
          label: 'Vendeur',
          value: 'vendeur',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
      defaultValue: 'client',
      required: true,
    },
  ],
  timestamps: true,
}
