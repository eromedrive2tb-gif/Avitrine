CREATE TABLE "impressions" (
	"id" serial PRIMARY KEY NOT NULL,
	"ad_id" integer NOT NULL,
	"placement" text,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"ad_id" integer NOT NULL,
	"placement" text,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp DEFAULT now()
);

ALTER TABLE "impressions" ADD CONSTRAINT "impressions_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE cascade ON UPDATE no action;
