#!/usr/bin/env python3
"""
Script complet pour supprimer tous les produits existants et importer les nouveaux
"""

import os
import sys
import subprocess
import time

def run_script(script_command, description):
    """Exécuter un script Python"""
    print(f"\n🔄 {description}")
    print("=" * 50)
    
    try:
        # Diviser la commande en arguments
        script_args = script_command.split()
        result = subprocess.run(
            [sys.executable] + script_args,
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        
        if result.returncode == 0:
            print(f"✅ {description} - Succès")
            if result.stdout:
                print("📄 Sortie:")
                print(result.stdout)
        else:
            print(f"❌ {description} - Échec")
            if result.stderr:
                print("🚨 Erreur:")
                print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution de {script_command}: {e}")
        return False
    
    return True

def main():
    print("🚀 Script de rafraîchissement des produits")
    print("=" * 60)
    print("Ce script va:")
    print("1. Supprimer tous les produits existants")
    print("2. Importer les nouveaux produits depuis bdd_vf_walk.csv")
    print("=" * 60)
    
    # Demander confirmation (ou utiliser l'argument --force pour éviter la confirmation)
    if len(sys.argv) > 1 and sys.argv[1] == '--force':
        print("\n⚡ Mode automatique activé (--force)")
    else:
        confirm = input("\n⚠️ Êtes-vous sûr de vouloir continuer ? (oui/non): ")
        if confirm.lower() not in ['oui', 'o', 'yes', 'y']:
            print("❌ Opération annulée")
            return
    
    # Étape 1: Supprimer les anciens produits
    print("\n🗑️ ÉTAPE 1: Suppression des anciens produits")
    force_mode = "--force" if len(sys.argv) > 1 and sys.argv[1] == '--force' else ""
    if not run_script(f"delete_products.py {force_mode}", "Suppression des produits existants"):
        print("❌ Échec de la suppression. Arrêt du script.")
        return
    
    # Pause pour laisser le temps à l'API de se stabiliser
    print("\n⏳ Pause de 3 secondes...")
    time.sleep(3)
    
    # Étape 2: Importer les nouveaux produits
    print("\n📥 ÉTAPE 2: Import des nouveaux produits")
    if not run_script(f"import_products.py {force_mode}", "Import des nouveaux produits"):
        print("❌ Échec de l'import.")
        return
    
    print("\n🎉 Rafraîchissement terminé avec succès!")
    print("\n📊 Résumé:")
    print("   ✅ Anciens produits supprimés")
    print("   ✅ Nouveaux produits importés depuis bdd_vf_walk.csv")
    print("\n🌐 Vous pouvez maintenant vérifier les produits sur:")
    print("   - Frontend: http://localhost:3000/products")
    print("   - CMS: http://localhost:3000/admin")

if __name__ == "__main__":
    main()
