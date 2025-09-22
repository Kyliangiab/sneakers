'use client'

import { AlertTriangle, CheckCircle } from 'lucide-react'

export default function PaymentTestWarning() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">
            🧪 Commande de Test - Aucun paiement réel
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Cette commande a été effectuée en mode test. Aucun vrai paiement n'a été effectué et
            aucun argent n'a été débité.
          </p>
          <div className="flex items-center text-xs text-yellow-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Commande simulée avec succès pour démonstration</span>
          </div>
        </div>
      </div>
    </div>
  )
}

