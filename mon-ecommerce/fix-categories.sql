-- Script pour corriger les catégories dans la base de données
-- Ce script met à jour les anciennes catégories vers les nouvelles

-- D'abord, mettre à jour les données existantes
UPDATE products 
SET category = CASE 
  WHEN category = 'clothing' THEN 'homme'
  WHEN category = 'electronics' THEN 'homme'
  WHEN category = 'home' THEN 'femme'
  WHEN category = 'sports' THEN 'unisexe'
  ELSE 'homme'
END;

-- Ensuite, supprimer l'ancien enum et créer le nouveau
DROP TYPE IF EXISTS enum_products_category CASCADE;

-- Créer le nouveau enum
CREATE TYPE enum_products_category AS ENUM ('homme', 'femme', 'enfants', 'unisexe');

-- Modifier la colonne pour utiliser le nouveau enum
ALTER TABLE products ALTER COLUMN category TYPE enum_products_category USING category::text::enum_products_category;
