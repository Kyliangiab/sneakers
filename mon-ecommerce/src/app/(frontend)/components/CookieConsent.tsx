'use client'

import { useState, useEffect } from 'react'
import { Cookie, Settings, Check, X } from 'lucide-react'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Toujours activé
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      // Charger les préférences sauvegardées
      const savedPreferences = localStorage.getItem('cookie-preferences')
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences))
      }
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    saveConsent(allAccepted)
    setShowBanner(false)
  }

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    }
    setPreferences(essentialOnly)
    saveConsent(essentialOnly)
    setShowBanner(false)
  }

  const savePreferences = () => {
    saveConsent(preferences)
    setShowBanner(false)
    setShowPreferences(false)
  }

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', 'true')
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs))
    
    // Ici vous pouvez ajouter la logique pour activer/désactiver les cookies
    // selon les préférences de l'utilisateur
    if (prefs.analytics) {
      // Activer Google Analytics, etc.
      console.log('Analytics cookies activés')
    }
    
    if (prefs.marketing) {
      // Activer les cookies marketing
      console.log('Marketing cookies activés')
    }
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // Ne pas permettre de désactiver les cookies essentiels
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowBanner(false)} />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Contenu principal */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Gestion des cookies
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                    analyser l'utilisation du site et personnaliser le contenu. 
                    Vous pouvez accepter tous les cookies ou personnaliser vos préférences.
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowPreferences(true)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Personnaliser
              </button>
              
              <button
                onClick={acceptEssential}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Essentiels uniquement
              </button>
              
              <button
                onClick={acceptAll}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                Accepter tout
              </button>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <a href="/rgpd" className="hover:text-orange-600 transition-colors">
                Politique de confidentialité
              </a>
              <a href="/rgpd#cookies" className="hover:text-orange-600 transition-colors">
                En savoir plus sur les cookies
              </a>
              <a href="/politique-retour" className="hover:text-orange-600 transition-colors">
                Politique de retour
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de préférences */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Préférences des cookies
                </h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">
                Gérez vos préférences de cookies. Vous pouvez activer ou désactiver 
                chaque catégorie selon vos besoins.
              </p>

              {/* Catégories de cookies */}
              <div className="space-y-6">
                {/* Cookies essentiels */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Cookies essentiels</h3>
                      <p className="text-sm text-gray-600">
                        Nécessaires au fonctionnement du site
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Toujours actif</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Ces cookies sont nécessaires pour le fonctionnement du site web et ne peuvent pas être désactivés. 
                    Ils incluent les cookies de session, de sécurité et de préférences de base.
                  </p>
                </div>

                {/* Cookies analytiques */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Cookies analytiques</h3>
                      <p className="text-sm text-gray-600">
                        Pour analyser l'utilisation du site
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site 
                    en collectant et rapportant des informations de manière anonyme.
                  </p>
                </div>

                {/* Cookies marketing */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Cookies marketing</h3>
                      <p className="text-sm text-gray-600">
                        Pour personnaliser les publicités
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Ces cookies sont utilisés pour afficher des publicités pertinentes et mesurer 
                    l'efficacité des campagnes publicitaires.
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 transition-colors"
                >
                  Sauvegarder les préférences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
