#!/usr/bin/env python3
"""
Script de test pour vérifier la connexion à Payload
"""

import requests
import json

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"

def test_connection():
    """Tester la connexion à Payload"""
    print("🔍 Test de connexion à Payload...")
    
    try:
        # Test de base
        response = requests.get(f"{PAYLOAD_API_URL}/products", timeout=10)
        print(f"✅ API accessible: {response.status_code}")
        
        # Test d'authentification
        auth_response = requests.post(
            f"{PAYLOAD_API_URL}/users/login",
            json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            },
            timeout=10
        )
        
        print(f"📊 Status code: {auth_response.status_code}")
        print(f"📄 Response: {auth_response.text[:200]}...")
        
        if auth_response.status_code == 200:
            print("✅ Authentification réussie")
            token = auth_response.json().get("token")
            print(f"🔑 Token reçu: {token[:20]}...")
            return True
        else:
            print(f"❌ Erreur authentification: {auth_response.status_code}")
            print(f"💡 Vérifie que l'utilisateur admin existe dans Payload")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter à Payload")
        print("💡 Assure-toi que le serveur est démarré (pnpm dev)")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_csv_file():
    """Tester la lecture du fichier CSV"""
    print("\n📄 Test du fichier CSV...")
    
    import csv
    import os
    
    csv_file = "../public/chaussuresonline_full 1.csv"
    
    if not os.path.exists(csv_file):
        print(f"❌ Fichier CSV non trouvé: {csv_file}")
        return False
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            first_row = next(reader)
            
            print(f"✅ Fichier CSV accessible")
            print(f"📊 Colonnes: {len(first_row)}")
            print(f"🏷️  Premier produit: {first_row.get('nom', 'Unknown')}")
            return True
            
    except Exception as e:
        print(f"❌ Erreur lecture CSV: {e}")
        return False

def main():
    print("🧪 Test de l'environnement d'import")
    print("===================================")
    
    csv_ok = test_csv_file()
    payload_ok = test_connection()
    
    print("\n📋 Résumé:")
    print(f"CSV: {'✅' if csv_ok else '❌'}")
    print(f"Payload: {'✅' if payload_ok else '❌'}")
    
    if csv_ok and payload_ok:
        print("\n🎉 Tout est prêt pour l'import!")
        print("Lance: python3 import_products.py")
    else:
        print("\n⚠️  Corrige les erreurs avant de continuer")

if __name__ == "__main__":
    main()
