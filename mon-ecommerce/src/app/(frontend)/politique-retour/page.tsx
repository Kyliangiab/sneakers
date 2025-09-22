'use client'

import { RotateCcw, Package, Clock, Shield, Truck, CreditCard } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PolitiqueRetourPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de Retour et d'Échange
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous nous engageons à vous offrir une expérience d'achat satisfaisante. 
            Découvrez nos conditions de retour et d'échange.
          </p>
        </div>

        {/* Navigation rapide */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a href="#delai" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium">Délai de retour</span>
            </a>
            <a href="#conditions" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Package className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-sm font-medium">Conditions</span>
            </a>
            <a href="#procedure" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Truck className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-sm font-medium">Procédure</span>
            </a>
            <a href="#remboursement" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CreditCard className="w-5 h-5 text-orange-600 mr-3" />
              <span className="text-sm font-medium">Remboursement</span>
            </a>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          {/* Délai de retour */}
          <section id="delai" className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Délai de Retour</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">⏰ Délai légal</h3>
                <p className="text-blue-800">
                  Vous disposez d'un <strong>délai de 14 jours</strong> à compter de la réception de votre commande 
                  pour exercer votre droit de rétractation, conformément à la législation française.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">📅 Calcul du délai</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Délai de 14 jours calendaires</li>
                    <li>• À compter de la réception</li>
                    <li>• Week-ends et jours fériés inclus</li>
                    <li>• Délai prolongé pour les fêtes</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🎁 Périodes spéciales</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Noël : délai prolongé</li>
                    <li>• Soldes : délai standard</li>
                    <li>• Commandes groupées : délai par article</li>
                    <li>• Articles personnalisés : délai réduit</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Conditions de retour */}
          <section id="conditions" className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Package className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Conditions de Retour</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Articles éligibles</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Articles non portés</h4>
                        <p className="text-sm text-gray-600">Dans leur emballage d'origine</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Étiquettes intactes</h4>
                        <p className="text-sm text-gray-600">Avec toutes les étiquettes d'origine</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Accessoires inclus</h4>
                        <p className="text-sm text-gray-600">Boîtes, lacets, certificats</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">État neuf</h4>
                        <p className="text-sm text-gray-600">Aucun signe d'usure</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-4">❌ Articles non éligibles</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Articles personnalisés</h4>
                        <p className="text-sm text-gray-600">Gravure, broderie personnalisée</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Articles portés</h4>
                        <p className="text-sm text-gray-600">Signes d'usure ou de salissure</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Articles endommagés</h4>
                        <p className="text-sm text-gray-600">Par l'utilisateur</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Articles intimes</h4>
                        <p className="text-sm text-gray-600">Pour des raisons d'hygiène</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
                <p className="text-yellow-800 text-sm">
                  Les articles retournés dans un état non conforme aux conditions ci-dessus 
                  pourront être refusés ou faire l'objet d'une déduction sur le remboursement.
                </p>
              </div>
            </div>
          </section>

          {/* Procédure de retour */}
          <section id="procedure" className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Truck className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Procédure de Retour</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold text-purple-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Demande de retour</h4>
                    <p className="text-gray-700 mb-2">
                      Connectez-vous à votre compte et accédez à la section "Mes commandes". 
                      Cliquez sur "Demander un retour" pour l'article concerné.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                      <strong>Alternative :</strong> Contactez notre service client à retour@sneakers.com
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Étiquette de retour</h4>
                    <p className="text-gray-700 mb-2">
                      Nous vous enverrons une étiquette de retour prépayée par email. 
                      Imprimez-la et collez-la sur votre colis.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                      <strong>Frais de retour :</strong> Gratuits pour les retours dans les délais
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Emballage</h4>
                    <p className="text-gray-700 mb-2">
                      Emballez l'article dans son emballage d'origine ou un emballage similaire. 
                      Ajoutez le bon de retour fourni.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                      <strong>Conseil :</strong> Utilisez un emballage solide pour éviter les dommages
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold text-purple-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expédition</h4>
                    <p className="text-gray-700 mb-2">
                      Déposez votre colis dans un point relais ou bureau de poste. 
                      Vous recevrez un numéro de suivi.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                      <strong>Suivi :</strong> Consultez le statut de votre retour dans votre compte
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-sm font-bold text-purple-600">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Traitement</h4>
                    <p className="text-gray-700 mb-2">
                      Nous vérifions l'état de l'article sous 48h ouvrées. 
                      Vous recevrez une confirmation par email.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                      <strong>Délai :</strong> 2-5 jours ouvrés pour le traitement complet
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Remboursement */}
          <section id="remboursement" className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Remboursement</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Méthodes de remboursement</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Carte bancaire</h4>
                        <p className="text-sm text-gray-600">Remboursement sur la carte utilisée</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Virement bancaire</h4>
                        <p className="text-sm text-gray-600">Pour les paiements par virement</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Bon d'achat</h4>
                        <p className="text-sm text-gray-600">Sur demande, valable 1 an</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Délais de remboursement</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Carte bancaire</h4>
                        <p className="text-sm text-gray-600">5-10 jours ouvrés</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Virement</h4>
                        <p className="text-sm text-gray-600">3-5 jours ouvrés</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Bon d'achat</h4>
                        <p className="text-sm text-gray-600">Immédiat par email</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-green-900 mb-2">💰 Montant remboursé</h4>
                <p className="text-green-800 text-sm mb-2">
                  Le remboursement inclut le prix de l'article et les frais de port initiaux. 
                  Les frais de retour sont à votre charge sauf en cas de défaut de notre part.
                </p>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Prix de l'article : 100%</li>
                  <li>• Frais de port : 100% (si retour complet)</li>
                  <li>• Frais de retour : Gratuits dans les délais</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Échanges */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <RotateCcw className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Échanges</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">🔄 Politique d'échange</h3>
                <p className="text-indigo-800">
                  Vous pouvez échanger votre article contre une autre taille, couleur ou modèle 
                  dans les mêmes conditions que les retours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">📏 Échange de taille</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Gratuit dans les délais</li>
                    <li>• Même modèle et couleur</li>
                    <li>• Disponibilité vérifiée</li>
                    <li>• Expédition prioritaire</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🎨 Échange de couleur</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Gratuit dans les délais</li>
                    <li>• Même modèle et taille</li>
                    <li>• Disponibilité vérifiée</li>
                    <li>• Expédition prioritaire</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Différence de prix</h4>
                <p className="text-yellow-800 text-sm">
                  En cas de différence de prix, un complément sera demandé ou un remboursement effectué 
                  selon le cas.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Service Client</h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-6">
                Notre équipe est là pour vous accompagner dans vos retours et échanges :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📞 Contact</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Email :</strong> retour@sneakers.com</p>
                    <p><strong>Téléphone :</strong> 01 23 45 67 89</p>
                    <p><strong>Horaires :</strong> Lun-Ven 9h-18h</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💬 Chat en ligne</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Disponible :</strong> Lun-Dim 9h-21h</p>
                    <p><strong>Réponse :</strong> Immédiate</p>
                    <p><strong>Langues :</strong> FR, EN</p>
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
