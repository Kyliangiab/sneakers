#!/usr/bin/env python3
"""
Script d'import des produits depuis le CSV vers Payload CMS
Adapté du script WeTheNew pour une meilleure compatibilité
"""

import requests
import json
import csv
import os
import re
import time
import random
import uuid
import asyncio
import aiohttp
import aiofiles
from typing import List, Dict, Optional
from urllib.parse import urlparse
import io
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"
CSV_FILE = "../public/chaussuresonline_full 1.csv"
OUTPUT_DIR = "imported_data"
IMAGES_DIR = f"{OUTPUT_DIR}/sneakers_images"

class ProductImporter:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.uploaded_media = {}  # Cache pour éviter les doublons
        self.setup_directories()

    def setup_directories(self):
        """Créer les dossiers nécessaires"""
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        os.makedirs(IMAGES_DIR, exist_ok=True)

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
                self.auth_token = response.json().get("token")
                self.session.headers.update({
                    "Authorization": f"Bearer {self.auth_token}"
                })
                print("✅ Authentification réussie")
                return True
            else:
                print(f"❌ Erreur authentification: {response.status_code}")
                print(f"📄 Réponse: {response.text[:200]}")
                return False
        except Exception as e:
            print(f"❌ Erreur connexion: {e}")
            return False

    def map_category(self, categorie: str) -> str:
        """Mapper les catégories CSV vers les catégories Payload"""
        category_mapping = {
            "Homme": "clothing",
            "Femme": "clothing", 
            "Enfant": "clothing",
            "Baskets et Sneakers": "sports",
            "Chaussures de sport": "sports",
            "Chaussures de ville": "clothing",
            "Chaussures de sécurité": "clothing"
        }
        return category_mapping.get(categorie, "clothing")

    def clean_text(self, text: str) -> str:
        """Nettoyer le texte"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text.strip())

    def generate_slug(self, nom: str, reference: str, product_index: int) -> str:
        """Générer un slug unique"""
        # Nettoyer le nom
        slug = re.sub(r'[^\w\s-]', '', nom.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')
        
        # Ajouter un UUID court pour garantir l'unicité
        unique_id = str(uuid.uuid4())[:8]
        return f"{slug}-{reference}-{unique_id}"

    def download_and_process_image(self, image_url: str, filename: str) -> str:
        """Télécharger et optimiser une image"""
        try:
            # Headers pour contourner les restrictions
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site'
            }

            # Nettoyer l'URL
            clean_url = image_url.split('?')[0]

            print(f"   🔗 URL: {clean_url[:50]}...")

            response = requests.get(clean_url, headers=headers, timeout=20, stream=True)

            if response.status_code == 200:
                # Vérifier que c'est bien une image
                content_type = response.headers.get('content-type', '')
                if not content_type.startswith('image/'):
                    print(f"   ⚠️ Pas une image: {content_type}")
                    return None

                # Lire le contenu
                image_data = response.content
                if len(image_data) < 1000:  # Image trop petite
                    print(f"   ⚠️ Image trop petite: {len(image_data)} bytes")
                    return None

                # Ouvrir l'image avec Pillow
                img = Image.open(io.BytesIO(image_data))

                # Redimensionner à 800x800 max en gardant les proportions
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)

                # Convertir en RGB avec fond blanc si nécessaire
                if img.mode in ("RGBA", "P"):
                    # Créer une image blanche de la même taille
                    white_bg = Image.new("RGB", img.size, (255, 255, 255))
                    # Coller l'image avec transparence sur le fond blanc
                    if img.mode == "RGBA":
                        white_bg.paste(img, mask=img.split()[-1])  # Utiliser le canal alpha comme masque
                    else:
                        white_bg.paste(img)
                    img = white_bg

                # Sauvegarder en JPEG optimisé
                output_path = f"{IMAGES_DIR}/{filename}.jpg"
                img.save(output_path, "JPEG", quality=85, optimize=True)

                print(f"   ✅ Image sauvée: {os.path.basename(output_path)} ({len(image_data)} bytes)")
                return output_path
            else:
                print(f"   ⚠️ Erreur HTTP {response.status_code}: {image_url[:50]}...")
                return None

        except requests.exceptions.Timeout:
            print(f"   ⚠️ Timeout: {filename}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"   ⚠️ Erreur réseau {filename}: {e}")
            return None
        except Exception as e:
            print(f"   ⚠️ Erreur traitement image {filename}: {e}")
            return None

    def upload_image_to_payload(self, image_path: str, alt_text: str) -> Dict:
        """Upload une image vers Payload CMS"""
        try:
            with open(image_path, 'rb') as f:
                files = {'file': (os.path.basename(image_path), f, 'image/jpeg')}
                data = {'alt': alt_text}

                response = self.session.post(
                    f"{PAYLOAD_API_URL}/media",
                    files=files,
                    data=data
                )

                if response.status_code == 201:
                    result = response.json()
                    print(f"   ✅ Upload réussi: ID {result.get('doc', {}).get('id', 'Unknown')}")
                    return result
                else:
                    print(f"   ❌ Erreur upload: {response.status_code}")
                    print(f"   📄 Réponse: {response.text[:200]}")
                    return None
        except Exception as e:
            print(f"   ❌ Erreur upload: {e}")
            return None

    def process_single_image(self, url: str, product_index: int, image_index: int) -> Optional[Dict]:
        """Traiter une seule image"""
        try:
            filename = f"product_{product_index}_image_{image_index}"
            local_path = self.download_and_process_image(url, filename)
            
            if local_path:
                alt_text = f"Image {image_index} du produit"
                image_doc = self.upload_image_to_payload(local_path, alt_text)
                
                if image_doc:
                    # Extraire l'ID depuis la structure Payload
                    media_id = image_doc.get('doc', {}).get('id') or image_doc.get('id')
                    if media_id:
                        return {
                            "image": media_id,
                            "alt": alt_text
                        }
            return None
        except Exception as e:
            print(f"   ❌ Erreur image {image_index}: {e}")
            return None

    def process_images(self, images_str: str, product_index: int) -> List[Dict]:
        """Traiter les images du produit en parallèle"""
        if not images_str:
            return []

        image_urls = [url.strip() for url in images_str.split(';') if url.strip()]
        processed_images = []

        # Traiter les images en parallèle (max 3 images)
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = []
            for i, url in enumerate(image_urls[:3]):
                future = executor.submit(self.process_single_image, url, product_index, i+1)
                futures.append(future)
            
            for i, future in enumerate(as_completed(futures)):
                try:
                    result = future.result()
                    if result:
                        processed_images.append(result)
                        print(f"   ✅ Image {i+1} uploadée")
                    else:
                        print(f"   ❌ Échec image {i+1}")
                except Exception as e:
                    print(f"   ❌ Erreur image {i+1}: {e}")

        return processed_images

    def create_variants(self, row: Dict) -> List[Dict]:
        """Créer les variantes du produit"""
        variants = []
        
        # Variante couleur
        if row.get('couleur_principale'):
            variants.append({
                "name": "Couleur",
                "value": row['couleur_principale'],
                "stock": 10,  # Stock par défaut
                "price": None  # Même prix que le produit principal
            })

        # Variante matière
        if row.get('matiere_exterieure'):
            variants.append({
                "name": "Matière",
                "value": row['matiere_exterieure'],
                "stock": 10,
                "price": None
            })

        return variants

    def create_product_from_row(self, row: Dict, product_index: int) -> Dict:
        """Créer un produit Payload depuis une ligne CSV"""
        nom = self.clean_text(row.get('nom', ''))
        reference = row.get('reference', '')
        
        # Générer le slug
        slug = self.generate_slug(nom, reference, product_index)
        
        # Traiter les images
        images = self.process_images(row.get('images', ''), product_index)
        
        # Créer les variantes
        variants = self.create_variants(row)
        
        # Créer la description riche au format Lexical
        description = {
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
                                "text": f"{nom}. ",
                                "version": 1
                            }
                        ]
                    }
                ]
            }
        }
        
        # Ajouter les détails techniques
        if row.get('matiere_exterieure'):
            description["root"]["children"].append({
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
                        "text": f"Matière extérieure: {row['matiere_exterieure']}. ",
                        "version": 1
                    }
                ]
            })
        
        if row.get('semelle'):
            description["root"]["children"].append({
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
                        "text": f"Semelle: {row['semelle']}. ",
                        "version": 1
                    }
                ]
            })

        if row.get('origine'):
            description["root"]["children"].append({
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
                        "text": f"Origine: {row['origine']}.",
                        "version": 1
                    }
                ]
            })

        return {
            "title": nom,
            "slug": slug,
            "category": self.map_category(row.get('categorie', '')),
            "price": float(row.get('prix', 0)) if row.get('prix') else 0,
            "description": description,
            "shortDescription": f"{nom} - {row.get('couleur_principale', '')}",
            "images": images,
            "variants": variants,
            "isFeatured": random.random() < 0.15,  # 15% featured
            "isNewArrival": random.random() < 0.25,  # 25% nouveautés
            "rating": round(random.uniform(3.5, 5.0), 1),  # Note aléatoire
            "reviewCount": random.randint(0, 200),
            "_status": "published"
        }

    def create_product(self, product_data: Dict) -> bool:
        """Créer un produit dans Payload"""
        try:
            response = self.session.post(
                f"{PAYLOAD_API_URL}/products",
                json=product_data
            )

            if response.status_code == 201:
                result = response.json()
                print(f"✅ Produit créé: {result.get('title', 'Unknown')} (ID: {result.get('id', 'Unknown')})")
                return True
            else:
                print(f"❌ Erreur création: {response.status_code}")
                print(f"📄 Réponse: {response.text[:200]}")
                return False

        except Exception as e:
            print(f"❌ Exception: {e}")
            return False

    def process_single_product(self, row: Dict, index: int) -> bool:
        """Traiter un seul produit"""
        try:
            print(f"\n🔄 Produit {index}: {row.get('nom', 'Unknown')}")
            print(f"   💰 Prix: {row.get('prix', 'N/A')}€")
            print(f"   🎨 Couleur: {row.get('couleur_principale', 'N/A')}")
            
            product_data = self.create_product_from_row(row, index)
            return self.create_product(product_data)
        except Exception as e:
            print(f"❌ Erreur produit {index}: {e}")
            return False

    def import_from_csv(self, limit: Optional[int] = None, max_workers: int = 3):
        """Importer les produits depuis le CSV en parallèle"""
        print(f"🚀 Import des produits depuis {CSV_FILE}")
        print(f"⚡ Mode parallèle: {max_workers} workers")
        
        if not self.authenticate():
            return

        if not os.path.exists(CSV_FILE):
            print(f"❌ Fichier CSV non trouvé: {CSV_FILE}")
            return

        # Lire tous les produits d'abord
        products_data = []
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for i, row in enumerate(reader):
                if limit and i >= limit:
                    break
                products_data.append((row, i+1))

        total_count = len(products_data)
        success_count = 0
        failed_count = 0

        # Traiter les produits en parallèle
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = []
            for row, index in products_data:
                future = executor.submit(self.process_single_product, row, index)
                futures.append(future)
            
            for future in as_completed(futures):
                try:
                    if future.result():
                        success_count += 1
                    else:
                        failed_count += 1
                except Exception as e:
                    print(f"❌ Erreur future: {e}")
                    failed_count += 1

        print(f"\n🎉 Import terminé!")
        print(f"✅ Succès: {success_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📊 Taux: {(success_count/total_count)*100:.1f}%")
        print(f"\n🌐 Voir les résultats: http://localhost:3000/admin/collections/products")

def main():
    importer = ProductImporter()
    
    limit_input = input("Nombre de produits à importer (défaut: 10 pour test): ").strip()
    limit = int(limit_input) if limit_input.isdigit() else 10
    
    confirm = input(f"Importer {limit} produits? (y/N): ").strip().lower()
    if confirm == 'y':
        importer.import_from_csv(limit)
    else:
        print("❌ Import annulé")

if __name__ == "__main__":
    main()
