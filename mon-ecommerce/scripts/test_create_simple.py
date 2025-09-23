#!/usr/bin/env python3
"""
Script pour tester la création d'un produit simple
"""

import requests
import json

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"

def test_create_simple():
    """Tester la création d'un produit simple"""
    session = requests.Session()
    
    print("🔍 Test de création d'un produit simple")
    print("=" * 50)
    
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
            session.headers.update({'Authorization': f'JWT {token}'})
            print("✅ Authentification réussie")
        else:
            print(f"❌ Erreur d'authentification: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur lors de l'authentification: {e}")
        return False
    
    # Produit simple avec la structure exacte
    simple_product = {
        "title": "Test Simple Product",
        "slug": "test-simple-product-123",
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
                                "text": "Produit de test simple",
                                "version": 1
                            }
                        ]
                    }
                ]
            }
        },
        "shortDescription": "Produit de test simple",
        "images": [],
        "variants": [],
        "isFeatured": False,
        "isNewArrival": False,
        "rating": 4.0,
        "reviewCount": 0
    }
    
    print("📦 Données du produit:")
    print(json.dumps(simple_product, indent=2))
    
    # Tenter la création
    try:
        response = session.post(
            f"{PAYLOAD_API_URL}/products",
            json=simple_product,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\n📊 Statut de la réponse: {response.status_code}")
        print(f"📄 Headers de la réponse: {dict(response.headers)}")
        print(f"📄 Corps de la réponse: {response.text}")
        
        if response.status_code == 201:
            print("✅ Produit créé avec succès!")
            product_data = response.json()
            print(f"🆔 ID du produit: {product_data.get('id')}")
            return True
        else:
            print(f"❌ Erreur lors de la création: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de la création: {e}")
        return False

if __name__ == "__main__":
    test_create_simple()
