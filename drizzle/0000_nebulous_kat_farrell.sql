CREATE TABLE "admin_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'banner' NOT NULL,
	"placement" text DEFAULT 'home_top' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"cta_text" text,
	"image_url" text,
	"link" text NOT NULL,
	"category" text,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"priority" integer DEFAULT 0,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "checkouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"plan_id" integer NOT NULL,
	"external_id" text,
	"status" text DEFAULT 'pending',
	"payment_method" text,
	"order_bump" boolean DEFAULT false,
	"order_bump_ids" json,
	"total_amount" integer NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"customer_document" text,
	"customer_phone" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
CREATE TABLE "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"description" text,
	"icon_url" text,
	"thumbnail_url" text,
	"banner_url" text,
	"external_url" text,
	"category" text,
	"post_count" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"is_featured" boolean DEFAULT false,
	"is_advertiser" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "models_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
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
CREATE TABLE "payment_gateways" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"public_key" text,
	"secret_key" text,
	"postback_url" text,
	"is_active" boolean DEFAULT false,
	CONSTRAINT "payment_gateways_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"duration" integer NOT NULL,
	"benefits_json" json,
	"cta_text" text,
	"checkout_url" text,
	"accepts_pix" boolean DEFAULT true,
	"accepts_card" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer,
	"title" text,
	"content_url" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer,
	"external_id" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user',
	"subscription_status" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "whitelabel_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"whitelabel_post_id" integer NOT NULL,
	"s3_key" text NOT NULL,
	"url" text,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "whitelabel_media_s3_key_unique" UNIQUE("s3_key")
);
--> statement-breakpoint
CREATE TABLE "whitelabel_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"folder_name" text NOT NULL,
	"thumbnail_url" text,
	"icon_url" text,
	"banner_url" text,
	"post_count" integer DEFAULT 0,
	"status" text DEFAULT 'new',
	"last_synced_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "whitelabel_models_folder_name_unique" UNIQUE("folder_name")
);
--> statement-breakpoint
CREATE TABLE "whitelabel_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"whitelabel_model_id" integer NOT NULL,
	"folder_name" text NOT NULL,
	"title" text,
	"media_cdns" json,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "whitelabel_posts_whitelabel_model_id_folder_name_unique" UNIQUE("whitelabel_model_id","folder_name")
);
--> statement-breakpoint
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impressions" ADD CONSTRAINT "impressions_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whitelabel_media" ADD CONSTRAINT "whitelabel_media_whitelabel_post_id_whitelabel_posts_id_fk" FOREIGN KEY ("whitelabel_post_id") REFERENCES "public"."whitelabel_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whitelabel_posts" ADD CONSTRAINT "whitelabel_posts_whitelabel_model_id_whitelabel_models_id_fk" FOREIGN KEY ("whitelabel_model_id") REFERENCES "public"."whitelabel_models"("id") ON DELETE cascade ON UPDATE no action;