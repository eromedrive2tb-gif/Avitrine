ALTER TABLE "plans" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "card_style" text DEFAULT 'secondary';