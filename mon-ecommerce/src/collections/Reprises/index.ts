import { CollectionConfig } from 'payload/types'
import { adminOrVendeur } from '../../access/adminOrVendeur'
import { authenticated } from '../../access/authenticated'

export const Reprises: CollectionConfig = {
  slug: 'reprises',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'customerEmail', 'brand', 'model', 'size', 'condition', 'status', 'createdAt'],
  },
  access: {
    read: authenticated, // Les utilisateurs peuvent voir leurs propres reprises
    create: authenticated, // Les utilisateurs peuvent créer des demandes
    update: adminOrVendeur, // Seuls les admins et vendeurs peuvent modifier
    delete: adminOrVendeur, // Seuls les admins et vendeurs peuvent supprimer
    admin: adminOrVendeur, // Seuls les admins et vendeurs peuvent accéder au CMS
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data.reference) {
              // Générer une référence unique : REP-YYYYMMDD-HHMMSS-XXXX
              const now = new Date()
              const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
              const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
              const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
              data.reference = `REP-${dateStr}-${timeStr}-${random}`
            }
          },
        ],
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Client',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      label: 'Email du client',
    },
    {
      name: 'customerPhone',
      type: 'text',
      label: 'Téléphone du client',
    },
    {
      name: 'shoeDetails',
      type: 'group',
      label: 'Détails de la chaussure',
      fields: [
        {
          name: 'brand',
          type: 'text',
          required: true,
          label: 'Marque',
        },
        {
          name: 'model',
          type: 'text',
          required: true,
          label: 'Modèle',
        },
        {
          name: 'size',
          type: 'number',
          required: true,
          label: 'Taille',
          min: 35,
          max: 50,
        },
        {
          name: 'color',
          type: 'text',
          required: true,
          label: 'Couleur',
        },
        {
          name: 'condition',
          type: 'select',
          required: true,
          label: 'État',
          options: [
            { label: 'Neuf avec étiquette', value: 'neuf_etiquette' },
            { label: 'Neuf sans étiquette', value: 'neuf_sans_etiquette' },
            { label: 'Très bon état', value: 'tres_bon_etat' },
            { label: 'Bon état', value: 'bon_etat' },
            { label: 'État correct', value: 'etat_correct' },
            { label: 'Usé', value: 'use' },
          ],
        },
        {
          name: 'purchaseDate',
          type: 'date',
          label: 'Date d\'achat',
        },
        {
          name: 'purchasePrice',
          type: 'number',
          label: 'Prix d\'achat (€)',
          min: 0,
        },
        {
          name: 'originalBox',
          type: 'checkbox',
          label: 'Boîte d\'origine',
          defaultValue: false,
        },
        {
          name: 'originalReceipt',
          type: 'checkbox',
          label: 'Facture d\'origine',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Photos de la chaussure',
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description de la photo',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'En cours d\'évaluation', value: 'evaluating' },
        { label: 'Acceptée', value: 'accepted' },
        { label: 'Refusée', value: 'rejected' },
        { label: 'Paiement effectué', value: 'paid' },
        { label: 'Expédiée', value: 'shipped' },
        { label: 'Réceptionnée', value: 'received' },
        { label: 'Annulée', value: 'cancelled' },
      ],
    },
    {
      name: 'evaluation',
      type: 'group',
      label: 'Évaluation',
      fields: [
        {
          name: 'estimatedValue',
          type: 'number',
          label: 'Valeur estimée (€)',
          min: 0,
        },
        {
          name: 'offerPrice',
          type: 'number',
          label: 'Prix proposé (€)',
          min: 0,
        },
        {
          name: 'evaluationNotes',
          type: 'textarea',
          label: 'Notes d\'évaluation',
        },
        {
          name: 'evaluatedBy',
          type: 'relationship',
          relationTo: 'users',
          label: 'Évalué par',
        },
        {
          name: 'evaluationDate',
          type: 'date',
          label: 'Date d\'évaluation',
        },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      label: 'Expédition',
      fields: [
        {
          name: 'shippingAddress',
          type: 'group',
          label: 'Adresse d\'expédition',
          fields: [
            { name: 'firstName', type: 'text', required: true },
            { name: 'lastName', type: 'text', required: true },
            { name: 'address', type: 'text', required: true },
            { name: 'city', type: 'text', required: true },
            { name: 'postalCode', type: 'text', required: true },
            { name: 'country', type: 'text', required: true, defaultValue: 'France' },
          ],
        },
        {
          name: 'trackingNumber',
          type: 'text',
          label: 'Numéro de suivi',
        },
        {
          name: 'shippingDate',
          type: 'date',
          label: 'Date d\'expédition',
        },
        {
          name: 'receivedDate',
          type: 'date',
          label: 'Date de réception',
        },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      label: 'Paiement',
      fields: [
        {
          name: 'paymentMethod',
          type: 'select',
          label: 'Méthode de paiement',
          options: [
            { label: 'Virement bancaire', value: 'bank_transfer' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Chèque', value: 'check' },
            { label: 'Crédit boutique', value: 'store_credit' },
          ],
        },
        {
          name: 'paymentDate',
          type: 'date',
          label: 'Date de paiement',
        },
        {
          name: 'paymentReference',
          type: 'text',
          label: 'Référence de paiement',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes internes',
      admin: {
        description: 'Notes visibles uniquement par les admins et vendeurs',
      },
    },
  ],
  timestamps: true,
}
