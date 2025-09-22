'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, Mail, Phone, ArrowRight, Home } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function ConfirmationReprisePage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')

  const nextSteps = [
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: 'Évaluation en cours',
      description: 'Nos experts examinent votre demande et évaluent vos chaussures.',
      time: '24-48h',
    },
    {
      icon: <Mail className="w-6 h-6 text-orange-500" />,
      title: 'Réponse par email',
      description: 'Vous recevrez une proposition de prix par email avec les détails.',
      time: 'Sous 48h',
    },
    {
      icon: <ArrowRight className="w-6 h-6 text-orange-500" />,
      title: 'Expédition gratuite',
      description: "Si vous acceptez, nous vous envoyons une étiquette d'expédition gratuite.",
      time: 'Immédiat',
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-orange-500" />,
      title: 'Paiement rapide',
      description: 'Dès réception et validation, nous vous payons sous 24h.',
      time: '24h',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demande envoyée avec succès !</h1>
          <p className="text-xl text-gray-600 mb-2">
            Votre demande de reprise a été transmise à nos experts.
          </p>
          {reference && (
            <p className="text-lg text-gray-500">
              Référence :{' '}
              <span className="font-mono font-semibold text-orange-600">{reference}</span>
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Prochaines étapes</h2>
          <div className="space-y-6">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-4">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <span className="text-sm text-orange-600 font-medium bg-orange-100 px-3 py-1 rounded-full">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Informations importantes</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Conservez votre numéro de référence pour le suivi de votre demande.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Vérifiez vos emails (et spams) pour recevoir notre réponse.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Vous pouvez suivre l'état de votre demande dans votre compte.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>L'expédition est gratuite si vous acceptez notre offre.</span>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">reprise@sneakers.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium text-gray-900">01 23 45 67 89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center"
          >
            Voir mes demandes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            href="/"
            className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
