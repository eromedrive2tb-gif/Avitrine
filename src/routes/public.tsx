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
import { AdsService } from '../services/ads';
import { db } from '../db';
import { plans, users, subscriptions, paymentGateways, orderBumps } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

import { CheckoutPage } from '../pages/Checkout';

import { WhiteLabelModelCard } from '../components/molecules/WhiteLabelModelCard';
import { Button } from '../components/atoms/Button';

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
                    with: {
                        plan: true
                    }
                }
            }
        }) as any;

        if (user && user.subscription && Array.isArray(user.subscription)) {
            user.subscription = user.subscription.find((s: any) => s.status === 'active') || user.subscription[0];
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
  const page = Math.max(1, parseInt(c.req.query('page') || '1'));
  const pageSize = 20;
  const isHTMX = c.req.header('HX-Request') === 'true';
  
  try {
    if (isHTMX && page > 1) {
      const modelsResult = await WhitelabelDbService.getTopModelsWithThumbnails(page, pageSize);
      const hasNextPage = (pageSize * page) < modelsResult.total;
      
      return c.html(
        <>
          {modelsResult.data.map(m => (
            <WhiteLabelModelCard 
              id={m.id}
              name={m.name}
              postCount={m.postCount || 0}
              thumbnailUrl={m.thumbnailUrl}
            />
          ))}
          
          <div id="load-more-container" hx-swap-oob="true">
            {hasNextPage ? (
              <div class="mt-12 flex justify-center">
                <Button 
                  variant="secondary" 
                  className="min-w-[250px] !rounded-full py-4 border-white/20 hover:border-primary group"
                  onClick={`this.setAttribute('disabled', 'true'); htmx.ajax('GET', '/?page=${page + 1}', {target: '#new-revelations-grid', swap: 'beforeend'})`}
                >
                  <span class="flex items-center gap-2">
                    Carregar Mais Modelos
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </Button>
              </div>
            ) : <div class="mt-12"></div>}
          </div>
        </>
      );
    }

    // Buscar modelos (limit cumulativo para Carregar Mais se não for HTMX)
    const [modelsResult, homeAds] = await Promise.all([
      WhitelabelDbService.getTopModelsWithThumbnails(1, pageSize * page),
      AdsService.getActiveByPlacements(['home_top', 'home_middle', 'home_bottom', 'sidebar', 'feed_mix'])
    ]);
    
    const safeModels = modelsResult.data.map(m => ({ ...m, postCount: m.postCount || 0 }));
    
    return c.html(
      <HomePage 
        models={safeModels} 
        user={user} 
        ads={homeAds} 
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(modelsResult.total / pageSize),
          hasNextPage: (pageSize * page) < modelsResult.total
        }}
      />
    );
  } catch (e) {
    console.error("Erro na Home:", e);
    return c.html(<HomePage models={[]} user={user} ads={{}} />);
  }
});

publicRoutes.get('/models/:slug', async (c) => {
  const user = await getUser(c);
  const slug = c.req.param('slug');

  const model = await WhitelabelDbService.getModelBySlug(slug);

  if (!model) return c.notFound();

  // Busca os primeiros 20 posts com thumbnails assinadas e anúncios
  const [formattedPosts, profileAds] = await Promise.all([
    WhitelabelDbService.getModelPosts(model.id, 1, 20),
    AdsService.getActiveByPlacements(['model_profile', 'model_sidebar'])
  ]);

  return c.html(<ModelProfilePage model={model} initialPosts={formattedPosts} user={user} ads={profileAds} />);
});

// Outras rotas...
publicRoutes.get('/models', async (c) => {
  const user = await getUser(c);
  const page = parseInt(c.req.query('page') || '1') || 1;
  
  // Buscar modelos e anúncios em paralelo
  const [result, modelsAds] = await Promise.all([
    WhitelabelDbService.listModels(page, 20),
    AdsService.getActiveByPlacements(['models_grid', 'sidebar'])
  ]);
  
  return c.html(
    <ModelsPage 
      models={result.data} 
      user={user}
      ads={modelsAds}
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

publicRoutes.get('/login', async (c) => {
  const loginAds = await AdsService.getActiveByPlacement('login', 3);
  return c.html(<AuthPage type="login" ads={loginAds} />);
});

publicRoutes.get('/register', async (c) => {
  const registerAds = await AdsService.getActiveByPlacement('register', 3);
  return c.html(<AuthPage type="register" ads={registerAds} />);
});

export default publicRoutes;