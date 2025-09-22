'use client'

import { useState } from 'react'
import { CreditCard, Copy, Check, Info } from 'lucide-react'

interface TestCard {
  number: string
  description: string
  cvc: string
  expiry: string
  status: 'success' | 'decline' | '3d-secure'
}

const testCards: TestCard[] = [
  {
    number: '4242 4242 4242 4242',
    description: 'Carte Visa - Paiement réussi',
    cvc: '123',
    expiry: '12/34',
    status: 'success',
  },
  {
    number: '4000 0000 0000 0002',
    description: 'Carte Visa - Paiement refusé',
    cvc: '123',
    expiry: '12/34',
    status: 'decline',
  },
  {
    number: '4000 0025 0000 3155',
    description: 'Carte Visa - Authentification 3D Secure',
    cvc: '123',
    expiry: '12/34',
    status: '3d-secure',
  },
  {
    number: '4000 0000 0000 0069',
    description: 'Carte Visa - Expirée',
    cvc: '123',
    expiry: '12/34',
    status: 'decline',
  },
  {
    number: '5555 5555 5555 4444',
    description: 'Carte Mastercard - Paiement réussi',
    cvc: '123',
    expiry: '12/34',
    status: 'success',
  },
]

export default function TestCardsInfo() {
  const [copiedCard, setCopiedCard] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const copyToClipboard = async (text: string, cardNumber: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCard(cardNumber)
      setTimeout(() => setCopiedCard(null), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'decline':
        return 'text-red-600 bg-red-100'
      case '3d-secure':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅'
      case 'decline':
        return '❌'
      case '3d-secure':
        return '🔐'
      default:
        return '💳'
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            🧪 Mode Test - Aucun vrai paiement ne sera effectué
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Ce site utilise Stripe en mode test. Vous pouvez utiliser les cartes de test ci-dessous
            pour simuler un paiement.
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-1" />
            {isExpanded ? 'Masquer' : 'Voir'} les cartes de test
          </button>

          {isExpanded && (
            <div className="mt-4 space-y-3">
              {testCards.map((card, index) => (
                <div key={index} className="bg-white rounded-md p-3 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(card.status)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}
                      >
                        {card.description}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(card.number, card.number)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Copier le numéro de carte"
                    >
                      {copiedCard === card.number ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Numéro:</span> {card.number}
                    </div>
                    <div>
                      <span className="font-medium">CVC:</span> {card.cvc}
                    </div>
                    <div>
                      <span className="font-medium">Expiration:</span> {card.expiry}
                    </div>
                    <div>
                      <span className="font-medium">Nom:</span> Test User
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Toutes ces cartes sont des cartes de test Stripe. Aucun
                  vrai paiement ne sera effectué et aucun argent ne sera débité de votre compte.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

