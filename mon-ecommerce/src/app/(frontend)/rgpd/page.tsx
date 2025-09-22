'use client'

import { Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function RGPDPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Protection des Données Personnelles (RGPD)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée
            conformément au Règlement Général sur la Protection des Données (RGPD).
          </p>
        </div>

        {/* Navigation rapide */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#collecte" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Database className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium">Collecte des données</span>
            </a>
            <a href="#utilisation" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Eye className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-sm font-medium">Utilisation</span>
            </a>
            <a href="#droits" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <UserCheck className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-sm font-medium">Vos droits</span>
            </a>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          {/* Collecte des données */}
          <section id="collecte" className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Database className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Collecte des Données</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Données collectées</h3>
              <p className="text-gray-700 mb-4">
                Nous collectons les données personnelles suivantes lorsque vous utilisez notre site :
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
                <li><strong>Données de facturation :</strong> adresse de facturation et de livraison</li>
                <li><strong>Données de commande :</strong> historique des achats, préférences</li>
                <li><strong>Données techniques :</strong> adresse IP, cookies, données de navigation</li>
                <li><strong>Données de paiement :</strong> informations de carte bancaire (via Stripe)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Base légale</h3>
              <p className="text-gray-700 mb-4">
                Le traitement de vos données personnelles est basé sur :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Exécution du contrat :</strong> pour traiter vos commandes</li>
                <li><strong>Intérêt légitime :</strong> pour améliorer nos services</li>
                <li><strong>Consentement :</strong> pour les cookies non essentiels</li>
                <li><strong>Obligation légale :</strong> pour la comptabilité et la facturation</li>
              </ul>
            </div>
          </section>

          {/* Utilisation des données */}
          <section id="utilisation" className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Utilisation des Données</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                Vos données personnelles sont utilisées pour :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Gestion des commandes</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Traitement des commandes</li>
                    <li>• Facturation et paiement</li>
                    <li>• Livraison des produits</li>
                    <li>• Service client</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Amélioration du service</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Personnalisation de l'expérience</li>
                    <li>• Analyse des tendances</li>
                    <li>• Développement de nouveaux produits</li>
                    <li>• Marketing ciblé (avec consentement)</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Partage des données</h3>
              <p className="text-gray-700 mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Stripe :</strong> pour le traitement des paiements</li>
                <li><strong>Transporteurs :</strong> pour la livraison des commandes</li>
                <li><strong>Autorités compétentes :</strong> si requis par la loi</li>
              </ul>
            </div>
          </section>

          {/* Sécurité */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Sécurité des Données</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Chiffrement SSL</h4>
                      <p className="text-sm text-gray-600">Toutes les données sont chiffrées en transit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Accès restreint</h4>
                      <p className="text-sm text-gray-600">Seuls les employés autorisés y ont accès</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sauvegardes sécurisées</h4>
                      <p className="text-sm text-gray-600">Données sauvegardées régulièrement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Audits réguliers</h4>
                      <p className="text-sm text-gray-600">Contrôles de sécurité périodiques</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vos droits */}
          <section id="droits" className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <UserCheck className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Vos Droits</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-6">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Droit d'accès</h4>
                    <p className="text-sm text-gray-600">Consulter vos données personnelles</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Droit de rectification</h4>
                    <p className="text-sm text-gray-600">Corriger des données inexactes</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Droit d'effacement</h4>
                    <p className="text-sm text-gray-600">Supprimer vos données</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Droit à la portabilité</h4>
                    <p className="text-sm text-gray-600">Récupérer vos données</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Droit d'opposition</h4>
                    <p className="text-sm text-gray-600">Vous opposer au traitement</p>
                  </div>
                  
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Droit de limitation</h4>
                    <p className="text-sm text-gray-600">Limiter le traitement</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">Exercer vos droits</h4>
                <p className="text-blue-800 text-sm mb-4">
                  Pour exercer vos droits, contactez-nous à l'adresse suivante :
                </p>
                <div className="text-blue-800 text-sm">
                  <p><strong>Email :</strong> rgpd@sneakers.com</p>
                  <p><strong>Courrier :</strong> SNEAKERS, Service RGPD, 123 Rue de la Mode, 75001 Paris</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Cookies</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                Notre site utilise des cookies pour améliorer votre expérience de navigation :
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies essentiels</h4>
                  <p className="text-sm text-gray-700">
                    Nécessaires au fonctionnement du site (panier, authentification, sécurité)
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies analytiques</h4>
                  <p className="text-sm text-gray-700">
                    Pour analyser l'utilisation du site et améliorer nos services
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies marketing</h4>
                  <p className="text-sm text-gray-700">
                    Pour personnaliser les publicités et mesurer leur efficacité
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                <p className="text-orange-800 text-sm">
                  <strong>Gestion des cookies :</strong> Vous pouvez accepter ou refuser les cookies non essentiels 
                  via le bandeau de consentement ou dans les paramètres de votre navigateur.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact</h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                Pour toute question concernant la protection de vos données personnelles :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Délégué à la Protection des Données</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Email :</strong> dpo@sneakers.com</p>
                    <p><strong>Téléphone :</strong> 01 23 45 67 89</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Autorité de contrôle</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>CNIL :</strong> Commission Nationale de l'Informatique et des Libertés</p>
                    <p><strong>Site :</strong> <a href="https://www.cnil.fr" className="text-blue-600 hover:underline">www.cnil.fr</a></p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer de la page */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
