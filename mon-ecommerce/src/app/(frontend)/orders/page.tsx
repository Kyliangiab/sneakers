'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Eye, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface Order {
  id: string
  orderNumber: string
  status:
    | 'REQUIRES_PAYMENT'
    | 'PAID'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'FAILED'
  total: number
  createdAt: string
  items: Array<{
    product: {
      title: string
      images: Array<{
        image: {
          url: string
        }
      }>
    }
    quantity: number
    price: number
  }>
}

const statusConfig = {
  REQUIRES_PAYMENT: {
    label: 'En attente de paiement',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Clock,
  },
  PAID: { label: 'Payée', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  confirmed: {
    label: 'Confirmée',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
  },
  shipped: { label: 'Expédiée', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Truck },
  delivered: {
    label: 'Livrée',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
  },
  cancelled: { label: 'Annulée', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle },
  FAILED: {
    label: 'Échec de paiement',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: AlertCircle,
  },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Récupérer l'ID de l'utilisateur connecté depuis Payload
    const userData = localStorage.getItem('user')
    console.log('Données utilisateur dans localStorage:', userData)

    if (userData) {
      try {
        const user = JSON.parse(userData)
        console.log('Utilisateur parsé:', user)

        if (!user.email) {
          console.error('Email utilisateur manquant')
          router.push('/auth')
          return
        }

        // Récupérer l'ID Payload de l'utilisateur par son email
        fetch(`/api/users/me?email=${encodeURIComponent(user.email)}`)
          .then((res) => res.json())
          .then((data) => {
            console.log('Réponse API users/me:', data)
            if (data.id) {
              setUserId(data.id)

              // Récupérer les commandes de l'utilisateur
              return fetch(`/api/orders/user?userId=${data.id}`)
            }
            throw new Error('Utilisateur non trouvé')
          })
          .then((res) => res.json())
          .then((data) => {
            console.log('Commandes récupérées:', data)
            if (data.docs) {
              setOrders(data.docs)
            }
            setLoading(false)
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des commandes:', error)
            setLoading(false)
          })
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error)
        router.push('/auth')
      }
    } else {
      // Rediriger vers la page de connexion si pas connecté
      router.push('/auth')
    }
  }, [router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusConfig = (status: Order['status']) => {
    return statusConfig[status] || statusConfig.pending
  }

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
          <p className="text-gray-600 mt-2">Suivez l'état de vos commandes</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande</h2>
            <p className="text-gray-600 mb-8">Vous n'avez pas encore passé de commande.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status)
              const StatusIcon = statusConfig.icon

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Commande {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Passée le {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {statusConfig.label}
                      </div>

                      <button
                        onClick={() => router.push(`/order-confirmation?orderId=${order.id}`)}
                        className="flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir les détails
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.product.images?.[0]?.image?.url || '/api/placeholder/400/400'}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} €
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        Total: {order.total.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
