'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    setIsUpdating(true)
    updateQuantity(id, newQuantity)
    // Petit délai pour l'effet visuel
    setTimeout(() => setIsUpdating(false), 300)
  }

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
  }

  const handleClearCart = () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart()
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">
              Découvrez notre collection de sneakers et ajoutez vos favoris à votre panier.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Panier</h1>
            <span className="ml-4 text-gray-500">
              ({totalItems} article{totalItems > 1 ? 's' : ''})
            </span>
          </div>

          {totalItems > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Vider le panier
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          {item.brand} • Taille: {item.size} • Couleur: {item.color}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {item.price.toFixed(2)} €
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-8 text-center font-medium">{item.quantity}</span>

                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})
                  </span>
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
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{(totalPrice + totalPrice * 0.2).toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Passer la commande
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Paiement sécurisé avec Stripe
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
