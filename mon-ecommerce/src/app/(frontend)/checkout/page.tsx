'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import {
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Home,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TestCardsInfo from '../components/TestCardsInfo'

interface Address {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
  email: string
}

interface CheckoutFormProps {
  onSuccess: (orderData: any) => void
  onError: (error: string) => void
  address: Address
}

function CheckoutForm({ onSuccess, onError, address }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Récupérer l'email de l'utilisateur connecté
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setUserEmail(user.email)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      // Créer la session de paiement Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items,
          customerEmail: address.email,
          shippingAddress: address,
          billingAddress: address, // Pour simplifier, même adresse
          userEmail: userEmail, // Email de l'utilisateur connecté
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url
      } else {
        onError(data.error || 'Erreur lors de la création de la session de paiement')
      }
    } catch (error) {
      onError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-orange-500" />
          Paiement sécurisé avec Stripe
        </h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Comment ça marche ?</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Cliquez sur "Payer" pour être redirigé vers Stripe</li>
            <li>2. Saisissez vos informations de carte sur la page sécurisée Stripe</li>
            <li>3. Confirmez le paiement</li>
            <li>4. Vous serez redirigé vers la confirmation de commande</li>
          </ol>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            Paiement sécurisé SSL
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            Conforme PCI DSS
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Redirection...' : `Payer ${(totalPrice + totalPrice * 0.2).toFixed(2)} €`}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    email: '',
  })
  const [orderData, setOrderData] = useState<any>(null)
  const [error, setError] = useState('')

  const steps = [
    { id: 1, name: 'Livraison', icon: MapPin },
    { id: 2, name: 'Paiement', icon: CreditCard },
    { id: 3, name: 'Confirmation', icon: CheckCircle },
  ]

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handlePaymentSuccess = (order: any) => {
    setOrderData(order)
    setCurrentStep(3)
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  // Rediriger si panier vide
  useEffect(() => {
    if (items.length === 0 && currentStep !== 3) {
      router.push('/cart')
    }
  }, [items.length, currentStep, router])

  if (items.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h2>
            <p className="text-gray-600 mb-6">Votre panier est vide.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                  Adresse de livraison
                </h2>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.firstName}
                        onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        required
                        value={address.lastName}
                        onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.address}
                      onChange={(e) => setAddress({ ...address, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                      <select
                        required
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center"
                    >
                      Continuer vers le paiement
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-orange-500" />
                    Récapitulatif de livraison
                  </h2>
                  <div className="text-gray-700">
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    <p>{address.address}</p>
                    <p>
                      {address.postalCode} {address.city}
                    </p>
                    <p>{address.country}</p>
                    <p className="mt-2">{address.phone}</p>
                    <p className="text-sm text-gray-500">{address.email}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Modifier l'adresse
                  </button>
                </div>

                {/* Informations sur les cartes de test */}
                <TestCardsInfo />

                <CheckoutForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  address={address}
                />

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && orderData && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande confirmée !</h2>
                <p className="text-gray-600 mb-6">
                  Votre commande <strong>{orderData.orderNumber}</strong> a été confirmée.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Un email de confirmation vous a été envoyé.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => router.push('/account')}
                    className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Voir mes commandes
                  </button>
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.size} • {item.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.price.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span>{(totalPrice * 0.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{(totalPrice + totalPrice * 0.2).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
