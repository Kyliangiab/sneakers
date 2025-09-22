'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LoadingSpinner from '../../components/LoadingSpinner'

interface ShoeDetails {
  brand: string
  model: string
  size: number
  color: string
  condition: string
  purchaseDate: string
  purchasePrice: number
  originalBox: boolean
  originalReceipt: boolean
}

interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function DemandeReprisePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [shoeDetails, setShoeDetails] = useState<ShoeDetails>({
    brand: '',
    model: '',
    size: 40,
    color: '',
    condition: '',
    purchaseDate: '',
    purchasePrice: 0,
    originalBox: false,
    originalReceipt: false,
  })
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const conditions = [
    { value: 'neuf_etiquette', label: 'Neuf avec étiquette' },
    { value: 'neuf_sans_etiquette', label: 'Neuf sans étiquette' },
    { value: 'tres_bon_etat', label: 'Très bon état' },
    { value: 'bon_etat', label: 'Bon état' },
    { value: 'etat_correct', label: 'État correct' },
    { value: 'use', label: 'Usé' },
  ]

  const brands = [
    'Nike', 'Adidas', 'Jordan', 'New Balance', 'Vans', 'Converse', 
    'Puma', 'Reebok', 'Asics', 'Under Armour', 'Fila', 'Champion',
    'Lacoste', 'Timberland', 'Dr. Martens', 'Clarks', 'Ecco', 'Geox',
    'Skechers', 'Salomon', 'Merrell', 'Columbia', 'The North Face',
    'Patagonia', 'Superga', 'Keds', 'Sperry', 'TOMS', 'Autre'
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 10) {
      setError('Maximum 10 photos autorisées')
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)

    // Créer les previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // Validation
      if (!customerEmail || !shoeDetails.brand || !shoeDetails.model || !shoeDetails.condition) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      if (images.length < 4) {
        throw new Error('Veuillez ajouter au moins 4 photos')
      }

      // Créer FormData pour l'upload
      const formData = new FormData()
      formData.append('customerEmail', customerEmail)
      formData.append('customerPhone', customerPhone)
      formData.append('shoeDetails', JSON.stringify(shoeDetails))
      formData.append('shippingAddress', JSON.stringify(shippingAddress))
      
      // Ajouter les images
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image)
      })

      const response = await fetch('/api/reprises', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la soumission')
      }

      const result = await response.json()
      setSuccess(true)
      
      // Rediriger vers la page de confirmation après 2 secondes
      setTimeout(() => {
        router.push(`/reprise/confirmation?reference=${result.reference}`)
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Demande envoyée avec succès !
          </h2>
          <p className="text-gray-600">
            Redirection vers la page de confirmation...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/reprise"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la reprise
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Demande de reprise
          </h1>
          <p className="text-gray-600 mt-2">
            Remplissez ce formulaire pour obtenir une évaluation gratuite de vos sneakers.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Informations</span>
            <span>Chaussures</span>
            <span>Photos</span>
            <span>Adresse</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Step 1: Customer Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Vos informations
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={nextStep}
                disabled={!customerEmail}
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Shoe Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Détails de la chaussure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque *
                </label>
                <select
                  value={shoeDetails.brand}
                  onChange={(e) => setShoeDetails({...shoeDetails, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Sélectionner une marque</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle *
                </label>
                <input
                  type="text"
                  value={shoeDetails.model}
                  onChange={(e) => setShoeDetails({...shoeDetails, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex: Air Max 90, Stan Smith, Old Skool..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille *
                </label>
                <input
                  type="number"
                  value={shoeDetails.size}
                  onChange={(e) => setShoeDetails({...shoeDetails, size: parseInt(e.target.value)})}
                  min="35"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur *
                </label>
                <input
                  type="text"
                  value={shoeDetails.color}
                  onChange={(e) => setShoeDetails({...shoeDetails, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex: Blanc, Noir, Bleu..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État *
                </label>
                <select
                  value={shoeDetails.condition}
                  onChange={(e) => setShoeDetails({...shoeDetails, condition: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Sélectionner l'état</option>
                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix d'achat (€)
                </label>
                <input
                  type="number"
                  value={shoeDetails.purchasePrice}
                  onChange={(e) => setShoeDetails({...shoeDetails, purchasePrice: parseFloat(e.target.value)})}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'achat
                </label>
                <input
                  type="date"
                  value={shoeDetails.purchaseDate}
                  onChange={(e) => setShoeDetails({...shoeDetails, purchaseDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shoeDetails.originalBox}
                    onChange={(e) => setShoeDetails({...shoeDetails, originalBox: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Boîte d'origine</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shoeDetails.originalReceipt}
                    onChange={(e) => setShoeDetails({...shoeDetails, originalReceipt: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Facture d'origine</span>
                </label>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Précédent
              </button>
              <button
                onClick={nextStep}
                disabled={!shoeDetails.brand || !shoeDetails.model || !shoeDetails.condition}
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Photos de la chaussure
            </h2>
            <p className="text-gray-600 mb-4">
              Ajoutez au moins 4 photos de votre chaussure (maximum 10). 
              Incluez la face, le profil, la semelle et les détails.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-lg font-medium text-gray-700 mb-2">
                  Cliquez pour ajouter des photos
                </span>
                <span className="text-sm text-gray-500">
                  PNG, JPG jusqu'à 10MB
                </span>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Photos ajoutées ({imagePreviews.length}/10)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Précédent
              </button>
              <button
                onClick={nextStep}
                disabled={images.length < 4}
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Shipping Address */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Adresse d'expédition
            </h2>
            <p className="text-gray-600 mb-6">
              Nous vous enverrons une étiquette d'expédition gratuite à cette adresse.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={shippingAddress.firstName}
                  onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays *
                </label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Précédent
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode}
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Envoi en cours...</span>
                  </>
                ) : (
                  'Envoyer la demande'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
