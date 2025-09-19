'use client'

import Link from 'next/link'
import { ArrowRight, Recycle, DollarSign, Clock, Shield } from 'lucide-react'

export default function RepriseSection() {
  const features = [
    {
      icon: DollarSign,
      title: 'Prix équitable',
      description: 'Obtenez le meilleur prix pour vos chaussures'
    },
    {
      icon: Clock,
      title: 'Processus rapide',
      description: 'Évaluation et paiement en 24h'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Transaction garantie et sécurisée'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-3 rounded-full">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Reprise de chaussures
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Donnez une seconde vie à vos sneakers ! Nous rachetons vos chaussures 
                en bon état et vous offrons un prix équitable. Un geste éco-responsable 
                qui profite à tous.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-sm">
                    <feature.icon className="w-8 h-8 text-orange-500 mx-auto" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/reprise"
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg group"
              >
                Vendre mes chaussures
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
                    <Recycle className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Comment ça marche ?
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>1. Prenez des photos de vos chaussures</p>
                      <p>2. Recevez une estimation instantanée</p>
                      <p>3. Envoyez-nous vos chaussures</p>
                      <p>4. Recevez votre paiement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
