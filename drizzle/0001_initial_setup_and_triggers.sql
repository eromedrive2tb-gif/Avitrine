-- Custom SQL migration file, put your code below! --

-- 0. Habilitar Extensão
CREATE EXTENSION IF NOT EXISTS plpython3u;

--> statement-breakpoint

-- 1. LIMPEZA TOTAL DE FUNÇÕES E TRIGGERS (Prevenção)
DROP TRIGGER IF EXISTS sale_completed_trigger ON checkouts;
--> statement-breakpoint
DROP TRIGGER IF EXISTS user_registered_trigger ON users;
--> statement-breakpoint
DROP TRIGGER IF EXISTS subscription_active_trigger ON subscriptions;
--> statement-breakpoint
DROP FUNCTION IF EXISTS notify_python(TEXT) CASCADE;
--> statement-breakpoint
DROP FUNCTION IF EXISTS trigger_sale_completed() CASCADE;
--> statement-breakpoint
DROP FUNCTION IF EXISTS trigger_user_registered() CASCADE;
--> statement-breakpoint
DROP FUNCTION IF EXISTS trigger_subscription_active() CASCADE;

--> statement-breakpoint

-- 2. ESTRUTURA DE TABELAS (IDEMPOTENTE)
CREATE TABLE IF NOT EXISTS "admin_settings" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ads" (
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
CREATE TABLE IF NOT EXISTS "checkouts" (
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
CREATE TABLE IF NOT EXISTS "users" (
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
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer,
	"external_id" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);

-- (Nota: Adicione as outras tabelas aqui se necessário, seguindo o padrão CREATE TABLE IF NOT EXISTS)

--> statement-breakpoint

-- 3. FUNÇÃO PYTHON ASSÍNCRONA (Subprocess/Curl)
CREATE OR REPLACE FUNCTION notify_python(message TEXT)
RETURNS VOID AS $$
    import subprocess
    import json

    url = "https://notifyhub-hono.pages.dev/api/notify/ff26ce22-f192-418f-ac5e-abd3248a3224"
    api_key = "sk_79301a2775d54ed590ae293581e18d90"
    payload = json.dumps({"message": message})

    cmd = ["curl", "-s", "-X", "POST", url, "-H", "Content-Type: application/json", "-H", f"X-API-Key: {api_key}", "-d", payload]

    try:
        # Popen dispara e não bloqueia o banco
        subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        plpy.warning(f"Erro ao disparar notificação: {str(e)}")
$$ LANGUAGE plpython3u;

--> statement-breakpoint

-- 4. FUNÇÕES DE TRIGGER (PL/pgSQL)
CREATE OR REPLACE FUNCTION trigger_sale_completed() RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status = 'pending' AND NEW.status = 'paid') THEN
        PERFORM notify_python('✅ VENDA: R$ ' || (NEW.total_amount/100.0)::TEXT || ' - ' || COALESCE(NEW.customer_name, 'Anon'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

CREATE OR REPLACE FUNCTION trigger_user_registered() RETURNS TRIGGER AS $$
BEGIN
    PERFORM notify_python('👤 NOVO USUÁRIO: ' || NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

CREATE OR REPLACE FUNCTION trigger_subscription_active() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.status = 'active') OR 
       (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'active') THEN
        PERFORM notify_python('⭐ ASSINATURA ATIVA: User ID ' || NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

-- 5. ATIVAÇÃO DOS TRIGGERS
CREATE TRIGGER sale_completed_trigger AFTER UPDATE ON checkouts FOR EACH ROW EXECUTE FUNCTION trigger_sale_completed();
--> statement-breakpoint
CREATE TRIGGER user_registered_trigger AFTER INSERT ON users FOR EACH ROW EXECUTE FUNCTION trigger_user_registered();
--> statement-breakpoint
CREATE TRIGGER subscription_active_trigger AFTER INSERT OR UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION trigger_subscription_active();

--> statement-breakpoint

-- 6. LIMPEZA E RECONSTRUÇÃO DE CONSTRAINTS (PUSH FIX)
ALTER TABLE "checkouts" DROP CONSTRAINT IF EXISTS "checkouts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;