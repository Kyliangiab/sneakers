import { CollectionConfig } from 'payload/types'
import { adminOrVendeur } from '../../access/adminOrVendeur'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerEmail', 'total', 'status', 'createdAt'],
  },
  access: {
    read: adminOrVendeur, // Seuls les admins et vendeurs peuvent voir les commandes
    create: adminOrVendeur, // Seuls les admins et vendeurs peuvent créer des commandes
    update: adminOrVendeur, // Seuls les admins et vendeurs peuvent modifier les commandes
    delete: adminOrVendeur, // Seuls les admins et vendeurs peuvent supprimer des commandes
    admin: adminOrVendeur, // Seuls les admins et vendeurs peuvent accéder au CMS
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Client',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'shipping',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'En attente de paiement', value: 'REQUIRES_PAYMENT' },
        { label: 'Payée', value: 'PAID' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'Expédiée', value: 'shipped' },
        { label: 'Livrée', value: 'delivered' },
        { label: 'Annulée', value: 'cancelled' },
        { label: 'Échec de paiement', value: 'FAILED' },
      ],
      defaultValue: 'REQUIRES_PAYMENT',
    },
    {
      name: 'stripeCheckoutSessionId',
      type: 'text',
      label: 'ID de session Stripe',
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      label: 'ID de payment intent Stripe',
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
  ],
}
