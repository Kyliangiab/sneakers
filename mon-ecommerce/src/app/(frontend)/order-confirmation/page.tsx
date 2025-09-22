'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Mail, Package, Clock, ArrowRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PaymentTestWarning from '../components/PaymentTestWarning'
import { useCart } from '../../../contexts/CartContext'

interface OrderData {
  id: string
  orderNumber: string
  status: string
  total: number
  items: Array<{
    title: string
    quantity: number
    price: number
    size: string
    color: string
    image: string
  }>
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: string
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartCleared, setCartCleared] = useState(false)

  useEffect(() => {
    const orderId = searchParams.get('orderId')

    if (orderId) {
      // Récupérer les données de commande depuis l'API Payload
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.docs && data.docs.length > 0) {
            const order = data.docs[0]
            setOrderData({
              id: order.id,
              orderNumber: order.orderNumber,
              status: order.status,
              total: order.total,
              items: order.items.map((item: any) => ({
                title: item.product?.title || 'Produit',
                quantity: item.quantity,
                price: item.price,
                size: item.size || 'N/A',
                color: item.color || 'N/A',
                image: item.product?.image?.url || '/api/placeholder/400/400',
              })),
              shippingAddress: order.shippingAddress || {
                address: 'Non spécifiée',
                city: '',
                postalCode: '',
                country: '',
              },
              createdAt: order.createdAt,
            })

            // Vider le panier automatiquement après une commande validée
            if (order.status === 'PAID' && !cartCleared) {
              clearCart()
              setCartCleared(true)
              console.log('Panier vidé automatiquement après commande validée')
            } else if (order.status === 'REQUIRES_PAYMENT' && !cartCleared) {
              // Vider le panier même si le paiement n'est pas encore confirmé
              // (au cas où le webhook Stripe met du temps à arriver)
              clearCart()
              setCartCleared(true)
              console.log('Panier vidé après création de commande (paiement en attente)')
            }
          }
          setLoading(false)
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération de la commande:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [searchParams, clearCart, cartCleared])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande introuvable</h2>
            <p className="text-gray-600 mb-6">Cette commande n'existe pas ou a expiré.</p>
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
        {/* Avertissement mode test */}
        <PaymentTestWarning />

        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 mb-4">
            Votre commande <strong>{orderData.orderNumber}</strong> a été confirmée et sera traitée
            sous peu.
          </p>

          {/* Message de confirmation du panier vidé */}
          {cartCleared && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-sm text-green-700">Votre panier a été automatiquement vidé</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email envoyé
            </div>
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              En préparation
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Livraison sous 2-3 jours
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h2>

              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                      <p className="text-xs text-gray-500">
                        Taille: {item.size} • Couleur: {item.color}
                      </p>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{orderData.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Adresse de livraison</h2>
              <div className="text-gray-700">
                <p>{orderData.shippingAddress.address}</p>
                <p>
                  {orderData.shippingAddress.postalCode} {orderData.shippingAddress.city}
                </p>
                <p>{orderData.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Status & Next Steps */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statut de la commande</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Commande confirmée</p>
                    <p className="text-xs text-gray-500">Paiement validé</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">En préparation</p>
                    <p className="text-xs text-gray-500">
                      Votre commande est en cours de préparation
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expédiée</p>
                    <p className="text-xs text-gray-500">En attente</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Livrée</p>
                    <p className="text-xs text-gray-500">En attente</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    Email de confirmation envoyé
                  </h3>
                  <p className="text-sm text-blue-700">
                    Un email de confirmation avec tous les détails de votre commande a été envoyé à
                    votre adresse email.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Prochaines étapes</h2>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-medium text-orange-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Préparation de votre commande
                    </p>
                    <p className="text-xs text-gray-500">Nous préparons vos articles avec soin</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-medium text-orange-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Expédition</p>
                    <p className="text-xs text-gray-500">
                      Vous recevrez un email avec le numéro de suivi
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-medium text-orange-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Livraison</p>
                    <p className="text-xs text-gray-500">Livraison sous 2-3 jours ouvrés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/account')}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                Voir mes commandes
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => router.push('/products')}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
