import { CollectionConfig } from 'payload/types'
import { adminOrVendeur } from '../../access/adminOrVendeur'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'totalSpent', 'updatedAt'],
  },
  access: {
    read: adminOrVendeur, // Seuls les admins et vendeurs peuvent voir les clients
    create: adminOrVendeur, // Seuls les admins et vendeurs peuvent créer des clients
    update: adminOrVendeur, // Seuls les admins et vendeurs peuvent modifier des clients
    delete: adminOrVendeur, // Seuls les admins et vendeurs peuvent supprimer des clients
    admin: adminOrVendeur, // Seuls les admins et vendeurs peuvent accéder au CMS
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      unique: true,
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
      name: 'phone',
      type: 'text',
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'type', type: 'select', options: ['billing', 'shipping'] },
        { name: 'address', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'orderCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastOrderDate',
      type: 'date',
    },
  ],
}
