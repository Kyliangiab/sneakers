import { CollectionConfig } from 'payload/types'
import { adminOrVendeur } from '../../access/adminOrVendeur'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'stock', 'category', 'updatedAt'],
  },
  access: {
    read: () => true, // Lecture publique pour le frontend
    admin: adminOrVendeur, // Seuls les admins et vendeurs peuvent accéder au CMS
    create: adminOrVendeur, // Seuls les admins et vendeurs peuvent créer des produits
    update: adminOrVendeur, // Seuls les admins et vendeurs peuvent modifier des produits
    delete: adminOrVendeur, // Seuls les admins et vendeurs peuvent supprimer des produits
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Homme', value: 'homme' },
        { label: 'Femme', value: 'femme' },
        { label: 'Enfants', value: 'enfants' },
        { label: 'Unisexe', value: 'unisexe' },
        // Anciennes catégories pour la migration
        { label: 'Électronique', value: 'electronics' },
        { label: 'Vêtements', value: 'clothing' },
        { label: 'Maison', value: 'home' },
        { label: 'Sport', value: 'sports' },
      ],
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Quantité en stock pour ce produit',
      },
    },
    {
      name: 'isInStock',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Produit disponible à la vente',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'stock',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isNewArrival',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
    },
    {
      name: 'reviewCount',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
  ],
}
