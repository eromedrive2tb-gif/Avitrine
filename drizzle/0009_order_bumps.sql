CREATE TABLE "order_bumps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"image_url" text,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "checkouts" ADD COLUMN "order_bump_ids" json;