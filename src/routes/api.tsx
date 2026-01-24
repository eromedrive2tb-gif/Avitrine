import { Hono } from 'hono';
import { setCookie, getCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { db } from '../db';
import { plans, subscriptions, users, paymentGateways, checkouts, orderBumps } from '../db/schema';
import { eq, sql, asc, inArray } from 'drizzle-orm';
import { AdminService } from '../services/admin';
import { WhitelabelDbService } from '../services/whitelabel';
import { AuthService } from '../services/auth';
import { JunglePayService, type PixChargeRequest, type PixChargeResult, type CardChargeRequest, type CardChargeResult } from '../services/junglepay';
import { SSEManager } from '../services/sse';
import { AdsService, type AdPlacement } from '../services/ads';

const apiRoutes = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Checkout Process
apiRoutes.post('/checkout/process', async (c) => {
    try {
        const body = await c.req.json(); 
        const { planId, paymentMethod, orderBump, email, name, cpf, phone, totalAmount } = body;

        // Create Checkout Record
        const [checkout] = await db.insert(checkouts).values({
            planId: parseInt(planId),
            paymentMethod,
            orderBump,
            totalAmount: parseInt(totalAmount),
            customerName: name,
            customerEmail: email,
            customerDocument: cpf,
            customerPhone: phone,
            status: 'pending'
        }).returning();

        return c.json({ success: true, checkoutId: checkout.id });
    } catch (e: any) {
        console.error("Checkout Process Error:", e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// --- Endpoint RPC: Gerar Cobrança PIX via JunglePay ---
apiRoutes.post('/checkout/pix', async (c) => {
    try {
        const body = await c.req.json() as PixChargeRequest & { orderBumpIds?: number[] };

        // Validação básica dos campos obrigatórios
        const requiredFields = ['customerName', 'customerEmail', 'customerDocument', 'totalAmount', 'planId'];
        for (const field of requiredFields) {
            if (!(field in body) || body[field as keyof PixChargeRequest] === undefined || body[field as keyof PixChargeRequest] === '') {
                return c.json<PixChargeResult>({
                    success: false,
                    error: `Campo obrigatório ausente: ${field}`,
                    code: 'INVALID_DATA'
                }, 400);
            }
        }

        // Converter orderBumpIds de string para array se necessário
        let orderBumpIds: number[] | undefined;
        if (body.orderBumpIds) {
            if (typeof body.orderBumpIds === 'string') {
                orderBumpIds = (body.orderBumpIds as string).split(',').map(Number).filter(n => !isNaN(n));
            } else if (Array.isArray(body.orderBumpIds)) {
                orderBumpIds = body.orderBumpIds.map(Number).filter(n => !isNaN(n));
            }
        }

        // Chamar o service JunglePay
        const result = await JunglePayService.createPixCharge({
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerDocument: body.customerDocument,
            customerPhone: body.customerPhone || '',
            totalAmount: Number(body.totalAmount),
            planId: Number(body.planId),
            orderBump: Boolean(body.orderBump),
            orderBumpIds: orderBumpIds
        });

        if (!result.success) {
            const statusCode = result.code === 'INVALID_DATA' ? 400 : 
                               result.code === 'GATEWAY_NOT_CONFIGURED' ? 503 : 
                               result.code === 'GATEWAY_INACTIVE' ? 503 : 500;
            return c.json<PixChargeResult>(result, statusCode);
        }

        return c.json<PixChargeResult>(result);

    } catch (e: any) {
        console.error("[PIX Checkout] Error:", e);
        return c.json<PixChargeResult>({
            success: false,
            error: `Erro interno: ${e.message}`,
            code: 'API_ERROR'
        }, 500);
    }
});

// --- Endpoint RPC: Cobrança Cartão de Crédito via JunglePay ---
apiRoutes.post('/checkout/card', async (c) => {
    try {
        const body = await c.req.json() as CardChargeRequest & { orderBumpIds?: number[] };

        // Validação básica dos campos obrigatórios
        const requiredFields = ['customerName', 'customerEmail', 'customerDocument', 'totalAmount', 'planId', 'cardHash'];
        for (const field of requiredFields) {
            if (!(field in body) || body[field as keyof CardChargeRequest] === undefined || body[field as keyof CardChargeRequest] === '') {
                return c.json<CardChargeResult>({
                    success: false,
                    error: `Campo obrigatório ausente: ${field}`,
                    code: 'INVALID_DATA'
                }, 400);
            }
        }

        // Converter orderBumpIds de string para array se necessário
        let orderBumpIds: number[] | undefined;
        if (body.orderBumpIds) {
            if (typeof body.orderBumpIds === 'string') {
                orderBumpIds = (body.orderBumpIds as string).split(',').map(Number).filter(n => !isNaN(n));
            } else if (Array.isArray(body.orderBumpIds)) {
                orderBumpIds = body.orderBumpIds.map(Number).filter(n => !isNaN(n));
            }
        }

        // Chamar o service JunglePay
        const result = await JunglePayService.createCardCharge({
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerDocument: body.customerDocument,
            customerPhone: body.customerPhone || '',
            totalAmount: Number(body.totalAmount),
            planId: Number(body.planId),
            orderBump: Boolean(body.orderBump),
            orderBumpIds: orderBumpIds,
            cardHash: body.cardHash,
            installments: Number(body.installments) || 1
        });

        if (!result.success) {
            const statusCode = result.code === 'INVALID_DATA' ? 400 : 
                               result.code === 'GATEWAY_NOT_CONFIGURED' ? 503 : 
                               result.code === 'GATEWAY_INACTIVE' ? 503 :
                               result.code === 'CARD_REFUSED' ? 402 : 500;
            return c.json<CardChargeResult>(result, statusCode);
        }

        return c.json<CardChargeResult>(result);

    } catch (e: any) {
        console.error("[Card Checkout] Error:", e);
        return c.json<CardChargeResult>({
            success: false,
            error: `Erro interno: ${e.message}`,
            code: 'API_ERROR'
        }, 500);
    }
});

// --- Endpoint SSE: Stream de eventos de pagamento ---
apiRoutes.get('/checkout/events/:checkoutId', async (c) => {
    const checkoutId = parseInt(c.req.param('checkoutId'));
    
    if (!checkoutId || isNaN(checkoutId)) {
        return c.json({ success: false, error: 'ID de checkout inválido' }, 400);
    }

    // Verificar se o checkout existe
    const [checkout] = await db
        .select({ id: checkouts.id, status: checkouts.status })
        .from(checkouts)
        .where(eq(checkouts.id, checkoutId))
        .limit(1);

    if (!checkout) {
        return c.json({ success: false, error: 'Checkout não encontrado' }, 404);
    }

    // Se já está pago, retornar imediatamente
    if (checkout.status === 'paid') {
        return c.json({ 
            success: true, 
            checkoutId: checkout.id, 
            status: 'paid', 
            isPaid: true,
            message: 'Pagamento já confirmado'
        });
    }

    // Criar stream SSE
    const stream = new ReadableStream({
        start(controller) {
            // Registrar cliente no SSEManager
            SSEManager.registerClient(checkoutId, controller);

            // Enviar evento inicial de conexão
            const encoder = new TextEncoder();
            const connectEvent = `event: connected\ndata: ${JSON.stringify({ checkoutId, status: 'waiting' })}\n\n`;
            controller.enqueue(encoder.encode(connectEvent));

            // Enviar heartbeat a cada 30 segundos para manter conexão viva
            const heartbeatInterval = setInterval(() => {
                SSEManager.sendHeartbeat(controller);
            }, 30000);

            // Timeout de 15 minutos
            const timeout = setTimeout(() => {
                clearInterval(heartbeatInterval);
                SSEManager.unregisterClient(checkoutId, controller);
                try {
                    const timeoutEvent = `event: timeout\ndata: ${JSON.stringify({ message: 'Connection timeout' })}\n\n`;
                    controller.enqueue(encoder.encode(timeoutEvent));
                    controller.close();
                } catch (e) {
                    // Conexão já fechada
                }
            }, 15 * 60 * 1000);

            // Limpar recursos quando o cliente desconectar
            return () => {
                clearInterval(heartbeatInterval);
                clearTimeout(timeout);
                SSEManager.unregisterClient(checkoutId, controller);
            };
        },
        cancel() {
            // Cliente fechou a conexão
            console.log(`[SSE] Client disconnected from checkout ${checkoutId}`);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no' // Para nginx
        }
    });
});

// --- Webhook JunglePay ---
apiRoutes.post('/webhook/junglepay', async (c) => {
    console.log("👉 Webhook Hit: /webhook/junglepay");
    try {
        const rawBody = await c.req.text();
        console.log("📦 Raw Body:", rawBody);
        
        const payload = JSON.parse(rawBody);
        console.log("✅ Payload Parsed:", payload);

        // Verificar se é uma atualização de transação
        if (payload.type !== 'transaction') {
            console.log("⚠️ Tipo ignorado:", payload.type);
            return c.json({ ignored: true });
        }

        const transaction = payload.data;
        const { status, id, customer, amount } = transaction;
        const externalId = String(id);

        console.log(`ℹ️ Processing JunglePay Transaction: ${externalId} | Status: ${status}`);

        if (status === 'paid') {
            // 1. Primeiro, atualizar o checkout usando o externalId
            const updatedCheckouts = await db.update(checkouts)
                .set({ status: 'paid', updatedAt: new Date() })
                .where(eq(checkouts.externalId, externalId))
                .returning();

            if (updatedCheckouts.length > 0) {
                const updatedCheckout = updatedCheckouts[0];
                console.log(`[JunglePay Webhook] Checkout ${updatedCheckout.id} atualizado para 'paid'`);
                
                // 2. Notificar clientes SSE imediatamente
                SSEManager.notifyPaymentConfirmed(updatedCheckout.id, {
                    status: 'paid',
                    paymentMethod: updatedCheckout.paymentMethod || undefined,
                    customerEmail: updatedCheckout.customerEmail || undefined
                });
            }

            // 2. Buscar usuário pelo email
            const foundUsers = await db.select().from(users).where(eq(users.email, customer.email)).limit(1);
            const user = foundUsers[0];

            if (!user) {
                console.log(`ℹ️ User not found for email ${customer.email}, checkout already updated.`);
                return c.json({ received: true, checkoutUpdated: updatedCheckouts.length > 0 });
            }

            // 3. Buscar plano pelo valor mais próximo
            const allPlans = await db.select().from(plans);
            let plan = null;
            if (allPlans.length > 0) {
                plan = allPlans.reduce((prev, curr) => {
                    return (Math.abs(curr.price - amount) < Math.abs(prev.price - amount) ? curr : prev);
                });
            }

            // 4. Criar ou ativar subscription
            const startDate = new Date();
            const durationDays = plan?.duration || 30;
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + durationDays);

            await db.insert(subscriptions).values({
                userId: user.id,
                planId: plan?.id || null,
                externalId: externalId,
                status: 'active',
                startDate: startDate,
                endDate: endDate
            });

            // 5. Atualizar status do usuário
            await db.update(users)
                .set({ subscriptionStatus: 1 })
                .where(eq(users.id, user.id));

            console.log(`[JunglePay Webhook] Subscription activated for user ${user.id} (Tx: ${externalId})`);
            return c.json({ received: true, activated: true, checkoutUpdated: updatedCheckouts.length > 0 });
        }

        if (status === 'waiting_payment') {
            console.log(`[JunglePay Webhook] Transaction ${externalId} waiting for payment`);
            return c.json({ received: true });
        }

        console.log("⚠️ Status não processado:", status);
        return c.json({ ignored: true });

    } catch (err: any) {
        console.error("❌ JunglePay Webhook Error:", err);
        return c.json({ error: err.message }, 500);
    }
});

// Admin Finance Routes
apiRoutes.post('/admin/finance/gateway', async (c) => {
  const body = await c.req.parseBody();
  const gatewayName = body['gatewayName'] as string;

  // Deactivate all
  await db.update(paymentGateways).set({ isActive: false });
  
  // Activate selected (Upsert logic)
  const result = await db.update(paymentGateways)
      .set({ isActive: true })
      .where(eq(paymentGateways.name, gatewayName))
      .returning();

  if (result.length === 0) {
      await db.insert(paymentGateways).values({
          name: gatewayName,
          isActive: true
      });
  }
  
  return c.redirect('/admin/finance?success=true');
});

apiRoutes.post('/admin/finance/junglepay', async (c) => {
  const body = await c.req.parseBody();
  const pk = body['publicKey'] as string;
  const sk = body['secretKey'] as string;
  const postbackUrl = body['postbackUrl'] as string;

  const result = await db.update(paymentGateways)
      .set({ publicKey: pk, secretKey: sk, postbackUrl: postbackUrl || null })
      .where(eq(paymentGateways.name, 'JunglePay'))
      .returning();

  if (result.length === 0) {
       await db.insert(paymentGateways).values({
          name: 'JunglePay',
          publicKey: pk,
          secretKey: sk,
          postbackUrl: postbackUrl || null,
          isActive: false 
      });
  }

  return c.redirect('/admin/finance?success=true');
});

// Admin Plan Update
apiRoutes.post('/admin/plans/update', async (c) => {
  const body = await c.req.parseBody();
  const id = parseInt(body['id'] as string);
  const priceRaw = body['price'] as string;
  const checkoutUrl = body['checkoutUrl'] as string;
  const acceptsPix = body['acceptsPix'] === 'true';
  const acceptsCard = body['acceptsCard'] === 'true';

  if (!id) return c.redirect('/admin/plans?error=Invalid ID');

  // Convert "29.90" or "29,90" to 2990
  const cleanPrice = priceRaw.replace(',', '.');
  const priceInCents = Math.round(parseFloat(cleanPrice) * 100);

  try {
    await db.update(plans)
        .set({ 
            price: priceInCents,
            checkoutUrl: checkoutUrl,
            acceptsPix: acceptsPix,
            acceptsCard: acceptsCard
        })
        .where(eq(plans.id, id));
    
    return c.redirect('/admin/plans?success=Updated');
  } catch (e) {
    console.error(e);
    return c.redirect('/admin/plans?error=Database Error');
  }
});

// Admin API
apiRoutes.post('/admin/whitelabel/activate', async (c) => {
  const body = await c.req.parseBody();
  const activateAll = body['all'] === 'true';
  const specificModel = body['model'] as string;

  try {
    const result = await AdminService.activateModels(activateAll, specificModel);

    return c.html(
      <div id="toast" class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-xl animate-[fadeIn_0.5s]">
        ✅ Processado: {result.processedCount} modelos. (+{result.newModelsCount} novos, +{result.newPostsCount} posts)
      </div>
    );

  } catch (err: any) {
    console.error(err);
    return c.html(
      <div id="toast" class="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded shadow-xl animate-[fadeIn_0.5s]">
        ❌ Erro ao ativar: {err.message}
      </div>
    );
  }
});


apiRoutes.get('/models', async (c) => {
  const pageParam = c.req.query('page');
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  const limit = 20;

  try {
    const result = await WhitelabelDbService.getTopModelsWithThumbnails(page, limit);

    return c.json({
      data: result.data,
      meta: { 
        page: result.page, 
        limit: result.limit, 
        count: result.total 
      }
    });

  } catch (err: any) {
    console.error("Erro API Models:", err);
    return c.json({ error: 'Erro ao processar modelos.' }, 500);
  }
});

// 2. Atualize a rota de posts da modelo para assinar os arquivos
apiRoutes.get('/models/:modelName/posts', async (c) => {
  const modelName = c.req.param('modelName');
  const page = parseInt(c.req.query('page') || '1');
  const limit = 20;

  try {
    const model = await WhitelabelDbService.getModelBySlug(modelName);

    if (!model) return c.json({ error: '404' }, 404);

    const formattedPosts = await WhitelabelDbService.getModelPosts(model.id, page, limit);

    return c.json({ data: formattedPosts, meta: { page, limit, count: formattedPosts.length } });
  } catch (err) {
    console.error("Erro API Posts:", err);
    return c.json({ error: 'Erro ao carregar posts' }, 500);
  }
});

// Auth API
apiRoutes.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body['email'] as string;
  const password = body['password'] as string;

  try {
    const user = await AuthService.login(email, password);
    if (!user) {
        return c.redirect('/login?error=Credenciais inválidas');
    }

    await AuthService.checkSubscriptionStatus(user.id);

    const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role
    };

        const token = await sign(tokenPayload, JWT_SECRET, 'HS256');
        setCookie(c, 'auth_token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production'
        });
    return c.redirect('/');
  } catch (err) {
    console.error("Login error:", err);
    return c.redirect('/login?error=Erro no servidor');
  }
});

apiRoutes.post('/register', async (c) => {
  const body = await c.req.parseBody();
  const email = body['email'] as string;
  const password = body['password'] as string;
  const name = body['name'] as string;
  
  try {
      const user = await AuthService.register(email, password, name);
      
      const tokenPayload = {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
          role: user.role
      };

          const token = await sign(tokenPayload, JWT_SECRET, 'HS256');
          setCookie(c, 'auth_token', token, {
              httpOnly: true,
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
              sameSite: 'Lax',
              secure: process.env.NODE_ENV === 'production'
          });      
      return c.redirect('/plans');
  } catch (err: any) {
      return c.redirect(`/register?error=${encodeURIComponent(err.message)}`);
  }
});

apiRoutes.post('/subscribe', async (c) => {
    const token = getCookie(c, 'auth_token');
    if (!token) return c.redirect('/login');

    try {
        const payload = await verify(token, JWT_SECRET, 'HS256');
        const body = await c.req.parseBody();
        const planId = parseInt(body['planId'] as string);

        if (!planId) return c.json({ error: 'Plan ID required' }, 400);

        await AuthService.createSubscription(payload.id as number, planId);
        
        return c.redirect('/admin');
    } catch (err) {
        console.error("Subscribe error:", err);
        return c.redirect('/login');
    }
});

// Webhook for Payment Success
apiRoutes.post('/webhook/dias/payment-sucess', async (c) => {
  console.log("👉 Webhook Hit: /webhook/dias/payment-sucess");
  try {
    const rawBody = await c.req.text();
    console.log("📦 Raw Body:", rawBody);
    
    const payload = JSON.parse(rawBody);
    console.log("✅ Payload Parsed:", payload);

    const { status, id, externalRef, amount, payer } = payload;
    const transactionId = externalRef || id;

    console.log(`ℹ️ Processing Transaction: ${transactionId} | Status: ${status}`);

    if (status === 'PENDING') {
      console.log(`🔍 Searching user: ${payer?.email}`);
      
      // Use standard select instead of query builder to avoid potential overhead/locks
      const foundUsers = await db.select().from(users).where(eq(users.email, payer.email)).limit(1);
      const user = foundUsers[0];

      if (!user) {
        console.error(`❌ Webhook Error: User not found for email ${payer.email}`);
        return c.json({ error: 'User not found' }, 404);
      }
      console.log(`👤 User Found: ${user.id}`);

      // Identify Plan by finding the closest price
      console.log(`🔍 Finding closest plan for amount: ${amount}`);
      const allPlans = await db.select().from(plans);
      let plan = null;
      
      if (allPlans.length > 0) {
        plan = allPlans.reduce((prev, curr) => {
          return (Math.abs(curr.price - amount) < Math.abs(prev.price - amount) ? curr : prev);
        });
      }
      
      console.log(`📋 Closest Plan Found: ${plan?.name} (ID: ${plan?.id}, Price: ${plan?.price})`);

      // 3. Create Pending Subscription
      await db.insert(subscriptions).values({
        userId: user.id,
        planId: plan ? plan.id : null, 
        externalId: transactionId,
        status: 'pending',
        startDate: null,
        endDate: null
      });

      console.log(`[Webhook] Pending subscription created for ${payer.email} (Tx: ${transactionId})`);
      return c.json({ received: true });
    }

    if (status === 'PAID') {
      console.log(`🔍 Searching subscription: ${transactionId}`);
      
      // 1. Find Pending Subscription
      const foundSubs = await db.select().from(subscriptions).where(eq(subscriptions.externalId, transactionId)).limit(1);
      const sub = foundSubs[0];

      if (!sub) {
        console.error(`Webhook Error: Subscription not found for Tx ${transactionId}`);
        return c.json({ error: 'Subscription not found' }, 404);
      }
      console.log(`🎫 Subscription Found: ${sub.id}`);

      // 2. Calculate Dates
      const startDate = new Date();
      let durationDays = 30; // Default
      
      if (sub.planId) {
         const foundPlans = await db.select().from(plans).where(eq(plans.id, sub.planId)).limit(1);
         if (foundPlans[0]) durationDays = foundPlans[0].duration;
      }

      const endDate = new Date();
      endDate.setDate(startDate.getDate() + durationDays);

      // 3. Update Subscription
      await db.update(subscriptions)
        .set({
          status: 'active',
          startDate: startDate,
          endDate: endDate
        })
        .where(eq(subscriptions.id, sub.id));

      // 4. Update User Status
      await db.update(users)
        .set({ subscriptionStatus: 1 })
        .where(eq(users.id, sub.userId));

      console.log(`[Webhook] Subscription activated for user ${sub.userId} (Tx: ${transactionId})`);
      return c.json({ received: true });
    }

    console.log("⚠️ Status ignored:", status);
    return c.json({ ignored: true });

  } catch (err: any) {
    console.error("❌ Webhook Fatal Error:", err);
    return c.json({ error: err.message }, 500);
  }
});

apiRoutes.post('/logout', (c) => {
  setCookie(c, 'auth_token', '', { 
      httpOnly: true, 
      path: '/', 
      maxAge: 0,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production'
  });
  return c.redirect('/login');
});

// --- Order Bumps CRUD Routes ---

// Listar todas as order bumps (admin)
apiRoutes.get('/admin/order-bumps', async (c) => {
  try {
    const bumps = await db
      .select()
      .from(orderBumps)
      .orderBy(asc(orderBumps.displayOrder), asc(orderBumps.id));
    
    return c.json({ success: true, data: bumps });
  } catch (e: any) {
    console.error("[OrderBumps] List Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Listar order bumps ativas (público - para checkout)
apiRoutes.get('/order-bumps/active', async (c) => {
  try {
    const bumps = await db
      .select()
      .from(orderBumps)
      .where(eq(orderBumps.isActive, true))
      .orderBy(asc(orderBumps.displayOrder), asc(orderBumps.id));
    
    return c.json({ success: true, data: bumps });
  } catch (e: any) {
    console.error("[OrderBumps] Active List Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Criar nova order bump
apiRoutes.post('/admin/order-bumps', async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, price, isActive, imageUrl, displayOrder } = body;

    if (!name || price === undefined) {
      return c.json({ success: false, error: 'Nome e preço são obrigatórios' }, 400);
    }

    const [newBump] = await db.insert(orderBumps).values({
      name,
      description: description || null,
      price: parseInt(price),
      isActive: isActive !== false,
      imageUrl: imageUrl || null,
      displayOrder: parseInt(displayOrder) || 0
    }).returning();

    return c.json({ success: true, data: newBump });
  } catch (e: any) {
    console.error("[OrderBumps] Create Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Atualizar order bump
apiRoutes.patch('/admin/order-bumps/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { name, description, price, isActive, imageUrl, displayOrder } = body;

    if (!id) {
      return c.json({ success: false, error: 'ID inválido' }, 400);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseInt(price);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);

    const [updated] = await db
      .update(orderBumps)
      .set(updateData)
      .where(eq(orderBumps.id, id))
      .returning();

    if (!updated) {
      return c.json({ success: false, error: 'Order bump não encontrada' }, 404);
    }

    return c.json({ success: true, data: updated });
  } catch (e: any) {
    console.error("[OrderBumps] Update Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Toggle status da order bump
apiRoutes.patch('/admin/order-bumps/:id/toggle', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    // Buscar status atual
    const [current] = await db
      .select({ isActive: orderBumps.isActive })
      .from(orderBumps)
      .where(eq(orderBumps.id, id))
      .limit(1);

    if (!current) {
      return c.json({ success: false, error: 'Order bump não encontrada' }, 404);
    }

    // Inverter status
    const [updated] = await db
      .update(orderBumps)
      .set({ isActive: !current.isActive })
      .where(eq(orderBumps.id, id))
      .returning();

    return c.json({ success: true, data: updated });
  } catch (e: any) {
    console.error("[OrderBumps] Toggle Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Deletar order bump
apiRoutes.delete('/admin/order-bumps/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    const [deleted] = await db
      .delete(orderBumps)
      .where(eq(orderBumps.id, id))
      .returning();

    if (!deleted) {
      return c.json({ success: false, error: 'Order bump não encontrada' }, 404);
    }

    return c.json({ success: true, data: deleted });
  } catch (e: any) {
    console.error("[OrderBumps] Delete Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Buscar order bumps por IDs (para processar pagamento)
apiRoutes.post('/order-bumps/by-ids', async (c) => {
  try {
    const body = await c.req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return c.json({ success: true, data: [], total: 0 });
    }

    const bumps = await db
      .select()
      .from(orderBumps)
      .where(inArray(orderBumps.id, ids.map(Number)));

    const total = bumps.reduce((sum, bump) => sum + (bump.price || 0), 0);

    return c.json({ success: true, data: bumps, total });
  } catch (e: any) {
    console.error("[OrderBumps] ByIds Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// === ADS API ROUTES ===

// Buscar anúncios ativos por placement (público)
apiRoutes.get('/ads/placement/:placement', async (c) => {
  try {
    const placement = c.req.param('placement') as AdPlacement;
    const limit = parseInt(c.req.query('limit') || '5');
    
    const ads = await AdsService.getActiveByPlacement(placement, limit);
    
    // Track impressions para cada anúncio retornado
    for (const ad of ads) {
      // Non-blocking impression tracking
      AdsService.trackImpression(ad.id).catch(() => {});
    }
    
    return c.json({ success: true, data: ads });
  } catch (e: any) {
    console.error("[Ads] Placement Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Buscar anúncios ativos por múltiplos placements (público)
apiRoutes.post('/ads/placements', async (c) => {
  try {
    const body = await c.req.json();
    const { placements } = body as { placements: AdPlacement[] };
    
    if (!placements || !Array.isArray(placements)) {
      return c.json({ success: false, error: 'Placements array required' }, 400);
    }
    
    const adsMap = await AdsService.getActiveByPlacements(placements);
    
    // Track impressions
    for (const placement of placements) {
      const ads = adsMap[placement] || [];
      for (const ad of ads) {
        AdsService.trackImpression(ad.id).catch(() => {});
      }
    }
    
    return c.json({ success: true, data: adsMap });
  } catch (e: any) {
    console.error("[Ads] Placements Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Track click (pixel de clique)
apiRoutes.post('/ads/:id/click', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    if (!id || isNaN(id)) {
      return c.json({ success: false, error: 'Invalid ad ID' }, 400);
    }
    
    await AdsService.trackClick(id);
    
    return c.json({ success: true });
  } catch (e: any) {
    console.error("[Ads] Click Track Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

// Track impression manually (alternativa ao auto-track)
apiRoutes.post('/ads/:id/impression', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    if (!id || isNaN(id)) {
      return c.json({ success: false, error: 'Invalid ad ID' }, 400);
    }
    
    await AdsService.trackImpression(id);
    
    return c.json({ success: true });
  } catch (e: any) {
    console.error("[Ads] Impression Track Error:", e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

export default apiRoutes;