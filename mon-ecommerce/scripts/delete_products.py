#!/usr/bin/env python3
"""
Script pour supprimer tous les produits existants de Payload CMS
"""

import requests
import json
import time
import sys

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"

class ProductDeleter:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None

    def authenticate(self):
        """S'authentifier avec Payload"""
        try:
            response = self.session.post(
                f"{PAYLOAD_API_URL}/users/login",
                json={
                    "email": ADMIN_EMAIL,
                    "password": ADMIN_PASSWORD
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('token')
                self.session.headers.update({
                    'Authorization': f'JWT {self.auth_token}'
                })
                print("✅ Authentification réussie")
                return True
            else:
                print(f"❌ Erreur d'authentification: {response.status_code}")
                print(response.text)
                return False
        except Exception as e:
            print(f"❌ Erreur lors de l'authentification: {e}")
            return False

    def get_all_products(self):
        """Récupérer tous les produits"""
        try:
            all_products = []
            page = 1
            limit = 100
            
            while True:
                response = self.session.get(
                    f"{PAYLOAD_API_URL}/products",
                    params={
                        'page': page,
                        'limit': limit
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    products = data.get('docs', [])
                    
                    if not products:
                        break
                    
                    all_products.extend(products)
                    print(f"📄 Page {page}: {len(products)} produits récupérés")
                    page += 1
                else:
                    print(f"❌ Erreur lors de la récupération des produits: {response.status_code}")
                    break
            
            print(f"📊 Total: {len(all_products)} produits trouvés")
            return all_products
            
        except Exception as e:
            print(f"❌ Erreur lors de la récupération des produits: {e}")
            return []

    def delete_product(self, product_id):
        """Supprimer un produit"""
        try:
            response = self.session.delete(f"{PAYLOAD_API_URL}/products/{product_id}")
            
            if response.status_code == 200:
                return True
            else:
                print(f"❌ Erreur lors de la suppression du produit {product_id}: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Erreur lors de la suppression du produit {product_id}: {e}")
            return False

    def delete_all_products(self):
        """Supprimer tous les produits"""
        if not self.authenticate():
            return False
        
        print("🔍 Récupération de tous les produits...")
        products = self.get_all_products()
        
        if not products:
            print("ℹ️ Aucun produit à supprimer")
            return True
        
        print(f"🗑️ Suppression de {len(products)} produits...")
        
        deleted_count = 0
        failed_count = 0
        
        for i, product in enumerate(products, 1):
            product_id = product.get('id')
            product_title = product.get('title', 'Sans titre')
            
            print(f"🗑️ [{i}/{len(products)}] Suppression: {product_title[:50]}...")
            
            if self.delete_product(product_id):
                deleted_count += 1
            else:
                failed_count += 1
            
            # Pause pour éviter de surcharger l'API
            time.sleep(0.1)
        
        print(f"\n✅ Suppression terminée:")
        print(f"   - Produits supprimés: {deleted_count}")
        print(f"   - Échecs: {failed_count}")
        
        return failed_count == 0

def main():
    print("🚀 Script de suppression des produits")
    print("=" * 50)
    
    deleter = ProductDeleter()
    
    # Demander confirmation (ou utiliser l'argument --force pour éviter la confirmation)
    if len(sys.argv) > 1 and sys.argv[1] == '--force':
        print("⚡ Mode automatique activé (--force)")
    else:
        confirm = input("⚠️ Êtes-vous sûr de vouloir supprimer TOUS les produits ? (oui/non): ")
        if confirm.lower() not in ['oui', 'o', 'yes', 'y']:
            print("❌ Suppression annulée")
            return
    
    success = deleter.delete_all_products()
    
    if success:
        print("\n🎉 Tous les produits ont été supprimés avec succès!")
    else:
        print("\n⚠️ Certains produits n'ont pas pu être supprimés")

if __name__ == "__main__":
    main()
