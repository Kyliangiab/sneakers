#!/usr/bin/env python3
"""
Script de test pour vérifier le nouveau fichier CSV et l'import
"""

import csv
import os

def test_csv_structure():
    """Tester la structure du nouveau CSV"""
    csv_file = "../public/bdd_vf_walk.csv"
    
    if not os.path.exists(csv_file):
        print(f"❌ Fichier CSV non trouvé: {csv_file}")
        return False
    
    print(f"✅ Fichier CSV trouvé: {csv_file}")
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            # Vérifier les colonnes
            columns = reader.fieldnames
            print(f"📋 Colonnes trouvées: {len(columns)}")
            for col in columns:
                print(f"   - {col}")
            
            # Lire quelques lignes pour tester
            print("\n🔍 Test des premières lignes:")
            for i, row in enumerate(reader):
                if i >= 3:  # Limiter à 3 lignes
                    break
                
                print(f"\n--- Ligne {i+1} ---")
                print(f"Catégorie: {row.get('categorie', 'N/A')}")
                print(f"Nom: {row.get('nom', 'N/A')[:50]}...")
                print(f"Prix: {row.get('prix', 'N/A')}")
                print(f"Référence: {row.get('reference', 'N/A')}")
                print(f"Images: {len(row.get('images', '').split(';')) if row.get('images') else 0} images")
                
                # Vérifier les champs requis
                required_fields = ['categorie', 'nom', 'prix', 'reference', 'images']
                missing_fields = [field for field in required_fields if not row.get(field)]
                
                if missing_fields:
                    print(f"⚠️ Champs manquants: {missing_fields}")
                else:
                    print("✅ Tous les champs requis sont présents")
            
            return True
            
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du CSV: {e}")
        return False

def test_category_mapping():
    """Tester le mapping des catégories"""
    from import_products import ProductImporter
    
    importer = ProductImporter()
    
    test_categories = ['Homme', 'Femme', 'Enfant', 'Enfants', 'Unisexe', 'Autre']
    
    print("\n🗂️ Test du mapping des catégories:")
    for cat in test_categories:
        mapped = importer.map_category(cat)
        print(f"   {cat} -> {mapped}")

def main():
    print("🧪 Test du nouveau fichier CSV et de l'import")
    print("=" * 50)
    
    # Test 1: Structure du CSV
    print("1️⃣ Test de la structure du CSV")
    csv_ok = test_csv_structure()
    
    if not csv_ok:
        print("❌ Test du CSV échoué")
        return
    
    # Test 2: Mapping des catégories
    print("\n2️⃣ Test du mapping des catégories")
    try:
        test_category_mapping()
    except Exception as e:
        print(f"❌ Erreur lors du test du mapping: {e}")
    
    print("\n✅ Tests terminés!")
    print("\n📝 Prochaines étapes:")
    print("   1. Exécuter delete_products.py pour supprimer les anciens produits")
    print("   2. Exécuter import_products.py pour importer les nouveaux produits")

if __name__ == "__main__":
    main()
