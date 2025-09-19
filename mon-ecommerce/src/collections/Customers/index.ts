import { CollectionConfig } from 'payload/types'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'totalSpent', 'updatedAt'],
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
