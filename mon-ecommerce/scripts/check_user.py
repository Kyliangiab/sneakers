#!/usr/bin/env python3
"""
Script pour vérifier l'utilisateur admin
"""

import requests
import json

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"

def check_user():
    """Vérifier l'utilisateur admin"""
    session = requests.Session()
    
    print("🔍 Vérification de l'utilisateur admin")
    print("=" * 40)
    
    # Authentification
    try:
        response = session.post(
            f"{PAYLOAD_API_URL}/users/login",
            json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user = data.get('user', {})
            
            print("✅ Authentification réussie")
            print(f"👤 Utilisateur: {user.get('name', 'N/A')}")
            print(f"📧 Email: {user.get('email', 'N/A')}")
            print(f"🎭 Rôle: {user.get('role', 'N/A')}")
            print(f"🆔 ID: {user.get('id', 'N/A')}")
            
            session.headers.update({'Authorization': f'JWT {token}'})
            
            # Tester l'accès aux utilisateurs
            print("\n🔍 Test d'accès aux utilisateurs...")
            users_response = session.get(f"{PAYLOAD_API_URL}/users")
            if users_response.status_code == 200:
                print("✅ Accès aux utilisateurs autorisé")
            else:
                print(f"❌ Accès aux utilisateurs refusé: {users_response.status_code}")
            
            # Tester l'accès aux produits
            print("\n🔍 Test d'accès aux produits...")
            products_response = session.get(f"{PAYLOAD_API_URL}/products")
            if products_response.status_code == 200:
                print("✅ Accès en lecture aux produits autorisé")
            else:
                print(f"❌ Accès en lecture aux produits refusé: {products_response.status_code}")
            
            # Tester la création d'un produit simple
            print("\n🔍 Test de création d'un produit simple...")
            simple_product = {
                "title": "Test Simple",
                "category": "homme",
                "price": 50.0
            }
            
            create_response = session.post(
                f"{PAYLOAD_API_URL}/products",
                json=simple_product,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"📊 Statut de création: {create_response.status_code}")
            if create_response.status_code != 201:
                print(f"📄 Réponse: {create_response.text}")
            
        else:
            print(f"❌ Erreur d'authentification: {response.status_code}")
            print(f"Réponse: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    check_user()
