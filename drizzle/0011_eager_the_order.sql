CREATE TABLE "clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"ad_id" integer NOT NULL,
	"placement" text,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "impressions" (
	"id" serial PRIMARY KEY NOT NULL,
	"ad_id" integer NOT NULL,
	"placement" text,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "external_url" text;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "post_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impressions" ADD CONSTRAINT "impressions_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_slug_unique" UNIQUE("slug");