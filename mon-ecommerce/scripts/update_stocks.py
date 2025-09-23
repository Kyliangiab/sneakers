#!/usr/bin/env python3
"""
Script pour mettre à jour les stocks des produits existants
"""

import requests
import json
import random

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"

class StockUpdater:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.authenticate()

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
                self.auth_token = data.get("token") or data.get("accessToken")
                
                if self.auth_token:
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.auth_token}"
                    })
                else:
                    cookies = response.cookies
                    self.session.cookies.update(cookies)
                
                print("✅ Authentification réussie")
                return True
            else:
                print(f"❌ Erreur authentification: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur connexion: {e}")
            return False

    def get_all_products(self):
        """Récupérer tous les produits"""
        try:
            all_products = []
            page = 1
            
            while True:
                response = self.session.get(
                    f"{PAYLOAD_API_URL}/products",
                    params={"page": page, "limit": 100}
                )
                
                if response.status_code != 200:
                    print(f"❌ Erreur récupération produits page {page}: {response.status_code}")
                    break
                
                data = response.json()
                products = data.get('docs', [])
                all_products.extend(products)
                
                print(f"📄 Page {page}: {len(products)} produits récupérés")
                
                if not data.get('hasNextPage'):
                    break
                page += 1
            
            print(f"📊 Total: {len(all_products)} produits récupérés")
            return all_products
            
        except Exception as e:
            print(f"❌ Erreur récupération produits: {e}")
            return []

    def generate_stock_value(self, product_title):
        """Générer une valeur de stock réaliste basée sur le titre du produit"""
        title_lower = product_title.lower()
        
        # Produits populaires = stock plus élevé
        if any(brand in title_lower for brand in ['jordan', 'nike', 'adidas']):
            return random.randint(15, 50)
        elif any(brand in title_lower for brand in ['new balance', 'puma', 'converse']):
            return random.randint(8, 25)
        else:
            return random.randint(3, 15)

    def update_product_stock(self, product_id, stock_value):
        """Mettre à jour le stock d'un produit"""
        try:
            # Déterminer si le produit est en stock
            is_in_stock = stock_value > 0
            
            update_data = {
                "stock": stock_value,
                "isInStock": is_in_stock
            }
            
            response = self.session.patch(
                f"{PAYLOAD_API_URL}/products/{product_id}",
                json=update_data
            )
            
            if response.status_code == 200:
                return True
            else:
                print(f"❌ Erreur mise à jour produit {product_id}: {response.status_code}")
                print(f"📄 Réponse: {response.text[:200]}")
                return False
                
        except Exception as e:
            print(f"❌ Erreur mise à jour produit {product_id}: {e}")
            return False

    def update_all_stocks(self):
        """Mettre à jour tous les stocks"""
        print("🔄 Mise à jour des stocks des produits...")
        
        products = self.get_all_products()
        if not products:
            print("❌ Aucun produit trouvé")
            return
        
        updated_count = 0
        failed_count = 0
        
        for product in products:
            product_id = product.get('id')
            product_title = product.get('title', 'Unknown')
            
            if not product_id:
                print(f"❌ Produit sans ID: {product_title}")
                failed_count += 1
                continue
            
            # Générer un stock réaliste
            stock_value = self.generate_stock_value(product_title)
            
            print(f"🔄 Mise à jour: {product_title[:50]}... -> Stock: {stock_value}")
            
            if self.update_product_stock(product_id, stock_value):
                updated_count += 1
                print(f"✅ Stock mis à jour: {stock_value}")
            else:
                failed_count += 1
                print(f"❌ Échec mise à jour")
        
        print(f"\n🎉 Mise à jour terminée!")
        print(f"✅ Succès: {updated_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📊 Taux: {(updated_count/len(products))*100:.1f}%")

def main():
    print("🚀 Script de mise à jour des stocks")
    print("=" * 50)
    
    updater = StockUpdater()
    updater.update_all_stocks()

if __name__ == "__main__":
    main()
