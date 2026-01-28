-- Custom SQL migration file, put your code below! --

-- Habilita a extensão caso ainda não tenha sido feito no banco
CREATE EXTENSION IF NOT EXISTS plpython3u;

--> statement-breakpoint

-- 1. LIMPEZA TOTAL
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

-- 2. FUNÇÃO PYTHON
CREATE OR REPLACE FUNCTION notify_python(message TEXT)
RETURNS VOID AS $$
    import requests
    import json

    url = "https://notifyhub-hono.pages.dev/api/notify/ff26ce22-f192-418f-ac5e-abd3248a3224"
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": "sk_79301a2775d54ed590ae293581e18d90"
    }
    payload = {"message": message}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code >= 400:
            plpy.warning(f"NotifyHub erro {response.status_code}: {response.text}")
    except Exception as e:
        plpy.warning(f"FALHA CRÍTICA: {str(e)}")
$$ LANGUAGE plpython3u;

--> statement-breakpoint

-- 3. TRIGGERS (Lógica de Disparo)

-- A. Venda Realizada
CREATE OR REPLACE FUNCTION trigger_sale_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status = 'pending' AND NEW.status = 'paid') THEN
        PERFORM notify_python(
            '✅ VENDA REALIZADA: R$ ' || (NEW.total_amount / 100.0)::TEXT || 
            ' - Cliente: ' || COALESCE(NEW.customer_name, 'Anônimo') || 
            ' (' || COALESCE(NEW.customer_email, 'Sem e-mail') || ')'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

CREATE TRIGGER sale_completed_trigger
    AFTER UPDATE ON checkouts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_sale_completed();

--> statement-breakpoint

-- B. Novo Usuário Cadastrado
CREATE OR REPLACE FUNCTION trigger_user_registered()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM notify_python(
        '👤 NOVO CADASTRO: ' || NEW.email || ' (ID: ' || NEW.id || ')'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

CREATE TRIGGER user_registered_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_user_registered();

--> statement-breakpoint

-- C. Assinatura Ativa
CREATE OR REPLACE FUNCTION trigger_subscription_active()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.status = 'active') OR 
       (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'active') THEN
        PERFORM notify_python(
            '⭐ ASSINATURA ATIVA: Usuário ID ' || NEW.user_id || ' no plano ' || COALESCE(NEW.plan_id::TEXT, 'N/A')
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

CREATE TRIGGER subscription_active_trigger
    AFTER INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_subscription_active();