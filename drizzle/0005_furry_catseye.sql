CREATE TABLE "payment_gateways" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"public_key" text,
	"secret_key" text,
	"is_active" boolean DEFAULT false,
	CONSTRAINT "payment_gateways_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "accepts_pix" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "plans" ADD COLUMN "accepts_card" boolean DEFAULT true;