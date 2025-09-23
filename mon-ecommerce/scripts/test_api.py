#!/usr/bin/env python3
"""
Script de test pour vérifier l'API Payload
"""

import requests
import json

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"

def test_api():
    """Tester l'API Payload"""
    session = requests.Session()
    
    print("🔍 Test de l'API Payload")
    print("=" * 40)
    
    # Test 1: Authentification
    print("1️⃣ Test d'authentification...")
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
            session.headers.update({'Authorization': f'JWT {token}'})
            print("✅ Authentification réussie")
        else:
            print(f"❌ Erreur d'authentification: {response.status_code}")
            print(f"Réponse: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur lors de l'authentification: {e}")
        return False
    
    # Test 2: Récupération des produits existants
    print("\n2️⃣ Test de récupération des produits...")
    try:
        response = session.get(f"{PAYLOAD_API_URL}/products")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {len(data.get('docs', []))} produits trouvés")
        else:
            print(f"❌ Erreur lors de la récupération: {response.status_code}")
            print(f"Réponse: {response.text}")
    except Exception as e:
        print(f"❌ Erreur lors de la récupération: {e}")
    
    # Test 3: Création d'un produit de test
    print("\n3️⃣ Test de création d'un produit...")
    try:
        test_product = {
            "title": "Test Product",
            "slug": "test-product-123",
            "category": "homme",
            "price": 99.99,
            "description": {
                "root": {
                    "type": "root",
                    "format": "",
                    "indent": 0,
                    "version": 1,
                    "children": [
                        {
                            "type": "paragraph",
                            "format": "",
                            "indent": 0,
                            "version": 1,
                            "children": [
                                {
                                    "type": "text",
                                    "format": 0,
                                    "style": "",
                                    "detail": 0,
                                    "mode": "normal",
                                    "text": "Produit de test",
                                    "version": 1
                                }
                            ]
                        }
                    ]
                }
            },
            "shortDescription": "Produit de test",
            "images": [],
            "variants": [],
            "isFeatured": False,
            "isNewArrival": False,
            "rating": 4.0,
            "reviewCount": 0,
            "_status": "published"
        }
        
        response = session.post(
            f"{PAYLOAD_API_URL}/products",
            json=test_product,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print("✅ Produit de test créé avec succès")
            product_data = response.json()
            product_id = product_data.get('id')
            
            # Supprimer le produit de test
            delete_response = session.delete(f"{PAYLOAD_API_URL}/products/{product_id}")
            if delete_response.status_code == 200:
                print("✅ Produit de test supprimé")
            else:
                print(f"⚠️ Impossible de supprimer le produit de test: {delete_response.status_code}")
                
        else:
            print(f"❌ Erreur lors de la création: {response.status_code}")
            print(f"Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de la création: {e}")
        return False
    
    print("\n✅ Tous les tests sont passés!")
    return True

if __name__ == "__main__":
    test_api()
