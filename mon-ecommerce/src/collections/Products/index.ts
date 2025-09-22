import { CollectionConfig } from 'payload/types'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'category', 'updatedAt'],
  },
  access: {
    read: () => true,
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
