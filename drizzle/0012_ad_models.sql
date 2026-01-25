-- Migration: Add fields for advertising models in the models table
-- These fields enable manual model creation for advertising purposes

ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "slug" text UNIQUE;
ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "thumbnail_url" text;
ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "external_url" text;
ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "category" text;
ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "post_count" integer DEFAULT 0;
ALTER TABLE "models" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active';
