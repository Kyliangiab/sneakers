import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { adminOrVendeur } from '../access/adminOrVendeur'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: adminOrVendeur, // Seuls les admins et vendeurs peuvent créer des catégories
    delete: adminOrVendeur, // Seuls les admins et vendeurs peuvent supprimer des catégories
    read: anyone, // Lecture publique pour le frontend
    update: adminOrVendeur, // Seuls les admins et vendeurs peuvent modifier des catégories
    admin: adminOrVendeur, // Seuls les admins et vendeurs peuvent accéder au CMS
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
