'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // États pour les formulaires
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const [signupForm, setSignupForm] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Connexion réussie !')
        
        // Sauvegarder les données utilisateur et le token
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        
        // Rediriger vers la page d'accueil après un court délai
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
        
        console.log('User logged in:', data.user)
      } else {
        setError(data.error || 'Erreur lors de la connexion')
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation côté client
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          email: signupForm.email,
          password: signupForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
        // Basculer vers l'onglet de connexion
        setActiveTab('login')
        // Pré-remplir l'email
        setLoginForm(prev => ({ ...prev, email: signupForm.email }))
      } else {
        setError(data.error || 'Erreur lors de la création du compte')
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (form: 'login' | 'signup', field: string, value: string) => {
    if (form === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: value }))
    } else {
      setSignupForm(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenue sur SNEAKERS
            </h1>
            <p className="text-gray-600">
              Connectez-vous ou créez un compte pour continuer
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
                activeTab === 'login'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Se connecter
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
                activeTab === 'signup'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              S'inscrire
            </button>
          </div>

          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Forms */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'login' ? (
              /* Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      value={loginForm.email}
                      onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-1 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Votre mot de passe"
                      value={loginForm.password}
                      onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <div className="w-1 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Se souvenir de moi</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-500">
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
                >
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  Continuer avec Google
                </button>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                  <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <input
                      id="signup-firstName"
                      type="text"
                      required
                      value={signupForm.firstName}
                      onChange={(e) => handleInputChange('signup', 'firstName', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-1 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <div className="relative">
                    <input
                      id="signup-lastName"
                      type="text"
                      required
                      value={signupForm.lastName}
                      onChange={(e) => handleInputChange('signup', 'lastName', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-1 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      value={signupForm.email}
                      onChange={(e) => handleInputChange('signup', 'email', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-1 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Votre mot de passe"
                      value={signupForm.password}
                      onChange={(e) => handleInputChange('signup', 'password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <div className="w-1 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="signup-confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirmer votre mot de passe"
                      value={signupForm.confirmPassword}
                      onChange={(e) => handleInputChange('signup', 'confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <div className="w-1 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      J'accepte les{' '}
                      <Link href="/terms" className="text-orange-600 hover:text-orange-500">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link href="/privacy" className="text-orange-600 hover:text-orange-500">
                        politique de confidentialité
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={!acceptTerms || loading}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </div>
                  ) : (
                    'Créer un compte'
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
                >
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  Continuer avec Google
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
