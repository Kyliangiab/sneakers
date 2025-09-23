#!/usr/bin/env python3
"""
Script pour corriger les références d'images dans Payload CMS
"""

import requests
import json
import os
import re
from pathlib import Path

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@sneakers.com"
ADMIN_PASSWORD = "123Soleil"

class MediaFixer:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.media_files = set()
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

    def scan_media_files(self):
        """Scanner les fichiers média disponibles"""
        media_dir = Path("public/media")
        if not media_dir.exists():
            print("❌ Dossier media non trouvé")
            return

        print("🔍 Scan des fichiers média...")
        for file_path in media_dir.rglob("*"):
            if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                self.media_files.add(file_path.name)
        
        print(f"📁 {len(self.media_files)} fichiers média trouvés")

    def get_media_collection(self):
        """Récupérer tous les médias de la collection"""
        try:
            response = self.session.get(f"{PAYLOAD_API_URL}/media")
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Erreur récupération médias: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Erreur: {e}")
            return None

    def fix_media_references(self):
        """Corriger les références d'images"""
        print("🔧 Correction des références d'images...")
        
        # Récupérer tous les médias
        media_data = self.get_media_collection()
        if not media_data:
            return

        media_docs = media_data.get('docs', [])
        print(f"📊 {len(media_docs)} entrées média trouvées")

        fixed_count = 0
        for media in media_docs:
            filename = media.get('filename')
            if not filename:
                continue

            # Vérifier si le fichier existe
            if filename not in self.media_files:
                print(f"⚠️ Fichier manquant: {filename}")
                
                # Chercher un fichier similaire
                similar_files = [f for f in self.media_files if self.is_similar_file(filename, f)]
                
                if similar_files:
                    new_filename = similar_files[0]
                    print(f"🔄 Remplacement: {filename} -> {new_filename}")
                    
                    # Mettre à jour le média
                    try:
                        update_response = self.session.patch(
                            f"{PAYLOAD_API_URL}/media/{media['id']}",
                            json={"filename": new_filename}
                        )
                        
                        if update_response.status_code == 200:
                            print(f"✅ Média {media['id']} mis à jour")
                            fixed_count += 1
                        else:
                            print(f"❌ Erreur mise à jour {media['id']}: {update_response.status_code}")
                    except Exception as e:
                        print(f"❌ Erreur: {e}")
                else:
                    print(f"❌ Aucun fichier similaire trouvé pour {filename}")

        print(f"✅ {fixed_count} références corrigées")

    def is_similar_file(self, original, candidate):
        """Vérifier si deux fichiers sont similaires"""
        # Extraire le nom de base sans extension
        original_base = re.sub(r'-\d+\.jpg$', '', original)
        candidate_base = re.sub(r'-\d+\.jpg$', '', candidate)
        
        # Vérifier si les noms de base correspondent
        return original_base == candidate_base

    def run(self):
        """Exécuter la correction"""
        print("🚀 Début de la correction des références média")
        
        if not self.authenticate():
            return
        
        self.scan_media_files()
        self.fix_media_references()
        
        print("🎉 Correction terminée")

if __name__ == "__main__":
    fixer = MediaFixer()
    fixer.run()
