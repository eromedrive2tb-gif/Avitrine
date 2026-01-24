import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';
import { HomePage } from '../pages/Home';
import { ModelsPage } from '../pages/Models';
import { PlansPage } from '../pages/Plans';
import { AuthPage } from '../pages/Auth';
import { ModelProfilePage } from '../pages/ModelProfile';
import { PostDetailPage } from '../pages/PostDetail';
import { WhitelabelDbService } from '../services/whitelabel';
import { db } from '../db';
import { plans, users, subscriptions, paymentGateways, orderBumps } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

import { CheckoutPage } from '../pages/Checkout';

const publicRoutes = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

async function getUser(c: any) {
    const token = getCookie(c, 'auth_token');
    if (!token) {
        // console.log("Cookie auth_token não encontrado");
        return null;
    }
    try {
        const payload = await verify(token, JWT_SECRET, 'HS256');
        // console.log("Usuário verificado:", payload.email);
        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id as number),
            with: {
                subscription: {
                    where: eq(subscriptions.status, 'active'),
                    with: {
                        plan: true
                    }
                }
            }
        });

        if (user && user.subscription && Array.isArray(user.subscription)) {
            // @ts-ignore - drizzle with multiple might return array
            user.subscription = user.subscription[0];
        }

        return user || null;
    } catch (e) {
        console.error("Falha na verificação do JWT:", e);
        return null;
    }
}

// ROTA HOME
publicRoutes.get('/', async (c) => {
  const user = await getUser(c);
  try {
    const signedModels = await WhitelabelDbService.getTopModelsWithThumbnails(1, 20);
    const safeModels = signedModels.map(m => ({ ...m, postCount: m.postCount || 0 }));
    return c.html(<HomePage models={safeModels} user={user} />);
  } catch (e) {
    console.error("Erro na Home:", e);
    return c.html(<HomePage models={[]} user={user} />);
  }
});

publicRoutes.get('/models/:slug', async (c) => {
  const user = await getUser(c);
  const slug = c.req.param('slug');

  const model = await WhitelabelDbService.getModelBySlug(slug);

  if (!model) return c.notFound();

  // Busca os primeiros 20 posts com thumbnails assinadas
  const formattedPosts = await WhitelabelDbService.getModelPosts(model.id, 1, 20);

  return c.html(<ModelProfilePage model={model} initialPosts={formattedPosts} user={user} />);
});

// Outras rotas...
publicRoutes.get('/models', async (c) => {
  const user = await getUser(c);
  const page = parseInt(c.req.query('page') || '1') || 1;
  const result = await WhitelabelDbService.listModels(page, 20);
  
  return c.html(
    <ModelsPage 
      models={result.data} 
      user={user}
      pagination={{
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        showingFrom: (result.page - 1) * result.limit + 1,
        showingTo: Math.min(result.page * result.limit, result.total),
        nextUrl: result.page < result.totalPages ? `/models?page=${result.page + 1}` : undefined,
        prevUrl: result.page > 1 ? `/models?page=${result.page - 1}` : undefined
      }} 
    />
  );
});
publicRoutes.get('/posts/:id', async (c) => {
  const user = await getUser(c);
  const id = c.req.param('id');
  return c.html(<PostDetailPage id={id} user={user} />);
});

publicRoutes.get('/plans', async (c) => {
  const user = await getUser(c);
  try {
      const dbPlans = await db.select().from(plans).orderBy(plans.duration);
      
      const COMMON_FEATURES = [
        "Acesso Ilimitado a todas as Modelos",
        "Conteúdo Exclusivo em 4K",
        "Chat Direto (VIP)",
        "Novas Modelos toda semana",
        "Cancelamento Fácil"
      ];

      const uiPlans = dbPlans.map(p => {
          const isAnnual = p.duration === 365;
          const isWeekly = p.duration === 7;
          
          return {
            id: p.id,
            name: p.name,
            price: (p.price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
            currency: 'R$',
            period: p.duration === 7 ? '/semana' : p.duration === 30 ? '/mês' : '/ano',
            features: COMMON_FEATURES,
            highlighted: isAnnual,
            variant: isAnnual ? 'primary' : isWeekly ? 'outline' : 'secondary',
            badge: isAnnual ? 'MELHOR VALOR' : undefined,
            checkoutUrl: p.checkoutUrl
          };
      });

      return c.html(<PlansPage plans={uiPlans} user={user} />);
  } catch (err) {
      console.error("Error fetching plans:", err);
      return c.html(<PlansPage plans={[]} user={user} />);
  }
});

publicRoutes.get('/checkout', async (c) => {
  const user = await getUser(c);
  const planId = c.req.query('planId');
  if (!planId) {
      return c.redirect('/plans');
  }
  
  const plan = await db.query.plans.findFirst({
      where: eq(plans.id, parseInt(planId))
  });

  if (!plan) return c.redirect('/plans');

  // Busca o gateway ativo
  const activeGateway = await db.query.paymentGateways.findFirst({
      where: eq(paymentGateways.isActive, true)
  });

  // Buscar order bumps ativas ordenadas
  const activeOrderBumps = await db
    .select()
    .from(orderBumps)
    .where(eq(orderBumps.isActive, true))
    .orderBy(asc(orderBumps.displayOrder), asc(orderBumps.id));

  return c.html(<CheckoutPage plan={plan} user={user} gateway={activeGateway} orderBumps={activeOrderBumps} />);
});

publicRoutes.get('/login', (c) => c.html(<AuthPage type="login" />));
publicRoutes.get('/register', (c) => c.html(<AuthPage type="register" />));

export default publicRoutes;