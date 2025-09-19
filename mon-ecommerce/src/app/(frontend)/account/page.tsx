'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface UserData {
  id: number
  name: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites' | 'settings'>('profile')

  useEffect(() => {
    // Récupérer les informations de l'utilisateur depuis le localStorage ou l'API
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/'
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
            <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
            <a
              href="/auth"
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
            >
              Se connecter
            </a>
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Mon Compte</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos commandes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profil utilisateur */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  {user.role === 'admin' ? 'Administrateur' : user.role === 'vendeur' ? 'Vendeur' : 'Client'}
                </span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Mon Profil
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5 mr-3" />
                  Mes Commandes
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Mes Favoris
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Paramètres
                </button>
              </nav>

              {/* Bouton de déconnexion */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations Personnelles</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={user.firstName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        value={user.lastName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={user.email}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors">
                      Modifier mes informations
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes Commandes</h2>
                  
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
                    <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande.</p>
                    <a
                      href="/products"
                      className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Découvrir nos produits
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes Favoris</h2>
                  
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori</h3>
                    <p className="text-gray-600 mb-6">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
                    <a
                      href="/products"
                      className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Découvrir nos produits
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                          <span className="ml-3 text-sm text-gray-700">Recevoir des emails promotionnels</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                          <span className="ml-3 text-sm text-gray-700">Notifications de commande</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                          <span className="ml-3 text-sm text-gray-700">Newsletter</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
                      <div className="space-y-3">
                        <button className="text-orange-600 hover:text-orange-700 text-sm">
                          Changer mon mot de passe
                        </button>
                        <button className="text-orange-600 hover:text-orange-700 text-sm block">
                          Activer l'authentification à deux facteurs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
