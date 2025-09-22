'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, DollarSign, Shield, Truck, Users, Zap } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ReprisePage() {
  const [isHovered, setIsHovered] = useState(false)

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-orange-500" />,
      title: "Prix compétitifs",
      description: "Nous vous offrons les meilleurs prix du marché pour vos sneakers d'occasion."
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: "Transaction sécurisée",
      description: "Paiement rapide et sécurisé dès validation de votre paire."
    },
    {
      icon: <Truck className="w-8 h-8 text-orange-500" />,
      title: "Expédition gratuite",
      description: "Nous prenons en charge les frais d'expédition pour toute reprise."
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      title: "Évaluation rapide",
      description: "Réponse sous 24-48h après réception de vos photos."
    }
  ]

  const conditions = [
    "Marques acceptées : Nike, Adidas, Jordan, New Balance, Vans, Converse, Puma, Reebok",
    "Tailles : 35 à 50 (hommes, femmes, enfants)",
    "État minimum : Bon état (pas de trous, semelles en bon état)",
    "Accessoires : Boîte d'origine et facture appréciés",
    "Photos : Minimum 4 photos (face, profil, semelle, détails)"
  ]

  const process = [
    {
      step: "1",
      title: "Déposez votre demande",
      description: "Remplissez le formulaire avec les détails de vos chaussures et ajoutez des photos."
    },
    {
      step: "2", 
      title: "Évaluation gratuite",
      description: "Nos experts évaluent votre paire et vous proposent un prix sous 24-48h."
    },
    {
      step: "3",
      title: "Expédition gratuite",
      description: "Si vous acceptez, nous vous envoyons une étiquette d'expédition gratuite."
    },
    {
      step: "4",
      title: "Paiement rapide",
      description: "Dès réception et validation, nous vous payons sous 24h."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Reprise de <span className="text-yellow-300">Sneakers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Vendez vos sneakers d'occasion au meilleur prix. 
              Évaluation gratuite, expédition gratuite, paiement rapide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reprise/demande"
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Vendre mes sneakers
                <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
              </Link>
              <Link
                href="#comment-ca-marche"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-200"
              >
                Comment ça marche ?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir notre reprise ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous simplifions la vente de vos sneakers avec un processus rapide et sécurisé.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="comment-ca-marche" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple en 4 étapes pour vendre vos sneakers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-lg shadow-md h-full">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-orange-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conditions de reprise
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez quelles chaussures nous acceptons et nos critères d'évaluation.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8">
              <ul className="space-y-4">
                {conditions.map((condition, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à vendre vos sneakers ?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Déposez votre demande maintenant et obtenez une évaluation gratuite en quelques minutes.
          </p>
          <Link
            href="/reprise/demande"
            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Commencer ma demande
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
