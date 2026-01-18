CREATE TABLE "admin_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon_url" text,
	"banner_url" text,
	"is_featured" boolean DEFAULT false,
	"is_advertiser" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"benefits_json" json,
	"cta_text" text,
	"checkout_url" text
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
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user',
	"subscription_status" boolean DEFAULT false,
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
ALTER TABLE "posts" ADD CONSTRAINT "posts_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whitelabel_media" ADD CONSTRAINT "whitelabel_media_whitelabel_post_id_whitelabel_posts_id_fk" FOREIGN KEY ("whitelabel_post_id") REFERENCES "public"."whitelabel_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whitelabel_posts" ADD CONSTRAINT "whitelabel_posts_whitelabel_model_id_whitelabel_models_id_fk" FOREIGN KEY ("whitelabel_model_id") REFERENCES "public"."whitelabel_models"("id") ON DELETE cascade ON UPDATE no action;