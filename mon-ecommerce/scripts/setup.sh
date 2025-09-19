#!/bin/bash

echo "🚀 Configuration de l'import de produits"
echo "========================================"

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances Python..."
cd scripts
pip3 install -r requirements.txt

echo "✅ Configuration terminée!"
echo ""
echo "📋 Instructions:"
echo "1. Assurez-toi que ton serveur Payload est démarré (pnpm dev)"
echo "2. Crée un utilisateur admin dans l'interface Payload (http://localhost:3000/admin)"
echo "3. Modifie les variables ADMIN_EMAIL et ADMIN_PASSWORD dans import_products.py"
echo "4. Lance le script: python3 import_products.py"
echo ""
echo "🎯 Le script va:"
echo "- Lire le fichier CSV des produits"
echo "- Télécharger et uploader les images"
echo "- Créer les produits avec variantes (couleur, matière)"
echo "- Importer tout dans Payload CMS"
