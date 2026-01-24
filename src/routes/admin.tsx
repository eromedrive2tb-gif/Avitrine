import { Hono } from 'hono';
import { db } from '../db';
import { plans, supportContacts, paymentGateways, checkouts, subscriptions, users, orderBumps } from '../db/schema';
import { eq, desc, like, or, sql, asc } from 'drizzle-orm';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminModels } from '../pages/admin/Models';
import { AdminAds } from '../pages/admin/Ads';
import { AdminAdsCreate } from '../pages/admin/AdsCreate';
import { AdminPlans } from '../pages/admin/Plans';
import { AdminSettings } from '../pages/admin/Settings';
import { AdminWhitelabel } from '../pages/admin/Whitelabel';
import { AdminSupport } from '../pages/admin/Support';
import { AdminFinance } from '../pages/admin/Finance';
import { AdminClients } from '../pages/admin/Clients';
import { WhitelabelDbService } from '../services/whitelabel';
import { AdsService, type AdStatus, type AdPlacement, type AdType } from '../services/ads';

const adminRoutes = new Hono();

adminRoutes.get('/', (c) => c.html(<AdminDashboard />));
adminRoutes.get('/models', (c) => c.html(<AdminModels />));

// === ADS ROUTES ===
adminRoutes.get('/ads', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1'));
  const statusFilter = c.req.query('status') as AdStatus | undefined;
  const placementFilter = c.req.query('placement') as AdPlacement | undefined;
  
  const result = await AdsService.list(page, 20, { 
    status: statusFilter, 
    placement: placementFilter 
  });
  
  // Formatar dados para exibição
  const formattedAds = result.data.map(ad => ({
    id: ad.id,
    name: ad.name,
    type: AdsService.formatTypeLabel(ad.type),
    placement: AdsService.formatPlacementLabel(ad.placement),
    impressions: ad.impressions?.toLocaleString('pt-BR') || '0',
    clicks: ad.clicks?.toLocaleString('pt-BR') || '0',
    status: ad.status === 'active' ? 'Active' : ad.status === 'paused' ? 'Paused' : 'Draft'
  }));
  
  return c.html(
    <AdminAds 
      ads={formattedAds} 
      pagination={{
        page: result.page,
        totalPages: result.totalPages,
        total: result.total
      }}
      filters={{ status: statusFilter, placement: placementFilter }}
    />
  );
});

adminRoutes.get('/ads/new', (c) => c.html(<AdminAdsCreate />));

adminRoutes.get('/ads/:id/edit', async (c) => {
  const id = parseInt(c.req.param('id'));
  const ad = await AdsService.getById(id);
  
  if (!ad) {
    return c.redirect('/admin/ads?error=not_found');
  }
  
  return c.html(<AdminAdsCreate ad={ad} isEditing={true} />);
});

adminRoutes.post('/ads/create', async (c) => {
  const body = await c.req.parseBody();
  
  try {
    await AdsService.create({
      name: body['name'] as string || body['title'] as string,
      type: body['type'] as AdType || 'banner',
      placement: body['placement'] as AdPlacement || 'home_top',
      status: body['status'] as AdStatus || 'draft',
      title: body['title'] as string,
      subtitle: body['subtitle'] as string,
      ctaText: body['ctaText'] as string,
      imageUrl: body['imageUrl'] as string,
      link: body['link'] as string || '#',
      category: body['category'] as string,
      priority: parseInt(body['priority'] as string) || 0,
    });
    
    return c.redirect('/admin/ads?success=created');
  } catch (e: any) {
    console.error('[Ads Create Error]', e);
    return c.redirect('/admin/ads?error=' + encodeURIComponent(e.message));
  }
});

adminRoutes.post('/ads/:id/update', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.parseBody();
  
  try {
    await AdsService.update({
      id,
      name: body['name'] as string || body['title'] as string,
      type: body['type'] as AdType,
      placement: body['placement'] as AdPlacement,
      status: body['status'] as AdStatus,
      title: body['title'] as string,
      subtitle: body['subtitle'] as string,
      ctaText: body['ctaText'] as string,
      imageUrl: body['imageUrl'] as string,
      link: body['link'] as string,
      category: body['category'] as string,
      priority: parseInt(body['priority'] as string) || 0,
    });
    
    return c.redirect('/admin/ads?success=updated');
  } catch (e: any) {
    console.error('[Ads Update Error]', e);
    return c.redirect('/admin/ads?error=' + encodeURIComponent(e.message));
  }
});

adminRoutes.post('/ads/:id/toggle', async (c) => {
  const id = parseInt(c.req.param('id'));
  
  try {
    await AdsService.toggleStatus(id);
    return c.redirect('/admin/ads?success=toggled');
  } catch (e: any) {
    console.error('[Ads Toggle Error]', e);
    return c.redirect('/admin/ads?error=' + encodeURIComponent(e.message));
  }
});

adminRoutes.post('/ads/:id/delete', async (c) => {
  const id = parseInt(c.req.param('id'));
  
  try {
    await AdsService.delete(id);
    return c.redirect('/admin/ads?success=deleted');
  } catch (e: any) {
    console.error('[Ads Delete Error]', e);
    return c.redirect('/admin/ads?error=' + encodeURIComponent(e.message));
  }
});

adminRoutes.get('/plans', async (c) => {
  // Ensure default plans exist
  const existingPlans = await db.select().from(plans);
  const requiredPlans = [
    { duration: 7, name: 'Semanal (Trial)', price: 990 },
    { duration: 30, name: 'Mensal', price: 2990 },
    { duration: 365, name: 'Anual', price: 19990 }
  ];

  for (const req of requiredPlans) {
     if (!existingPlans.find(p => p.duration === req.duration)) {
        await db.insert(plans).values({
            name: req.name,
            duration: req.duration,
            price: req.price,
            benefits: [],
            ctaText: 'Assinar Agora'
        });
     }
  }

  const allPlans = await db.select().from(plans).orderBy(plans.duration);
  const gateways = await db.select().from(paymentGateways).where(eq(paymentGateways.isActive, true));
  const activeGateway = gateways[0]?.name || 'Dias Marketplace';
  
  // Buscar order bumps
  const allOrderBumps = await db
    .select()
    .from(orderBumps)
    .orderBy(asc(orderBumps.displayOrder), asc(orderBumps.id));
  
  return c.html(<AdminPlans plans={allPlans} activeGateway={activeGateway} orderBumps={allOrderBumps} />);
});

adminRoutes.get('/finance', async (c) => {
  let gateways = await db.select().from(paymentGateways);
  
  if (gateways.length === 0) {
      await db.insert(paymentGateways).values([
          { name: 'Dias Marketplace', isActive: true },
          { name: 'JunglePay', isActive: false }
      ]);
      gateways = await db.select().from(paymentGateways);
  }

  const activeGateway = gateways.find(g => g.isActive)?.name || 'Dias Marketplace';
  const success = c.req.query('success') === 'true';

  // Pagination params
  const page = Math.max(1, parseInt(c.req.query('page') || '1'));
  const limit = 20;
  const offset = (page - 1) * limit;

  // Filter params
  const statusFilter = c.req.query('status') || '';
  const searchFilter = c.req.query('search') || '';

  let checkoutsList: any[] = [];
  let subscriptionsList: any[] = [];
  let total = 0;

  if (activeGateway === 'JunglePay') {
    // Buscar checkouts com join de planos
    let query = db
      .select({
        id: checkouts.id,
        customerName: checkouts.customerName,
        customerEmail: checkouts.customerEmail,
        customerDocument: checkouts.customerDocument,
        customerPhone: checkouts.customerPhone,
        totalAmount: checkouts.totalAmount,
        paymentMethod: checkouts.paymentMethod,
        status: checkouts.status,
        orderBump: checkouts.orderBump,
        planName: plans.name,
        createdAt: checkouts.createdAt
      })
      .from(checkouts)
      .leftJoin(plans, eq(checkouts.planId, plans.id))
      .orderBy(desc(checkouts.createdAt))
      .limit(limit)
      .offset(offset);

    // Aplicar filtros
    const conditions = [];
    if (statusFilter) {
      conditions.push(eq(checkouts.status, statusFilter as any));
    }
    if (searchFilter) {
      conditions.push(
        or(
          like(checkouts.customerName, `%${searchFilter}%`),
          like(checkouts.customerEmail, `%${searchFilter}%`),
          like(checkouts.customerDocument, `%${searchFilter}%`)
        )
      );
    }

    if (conditions.length > 0) {
      // @ts-ignore - drizzle typing issue
      query = query.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`);
    }

    checkoutsList = await query;

    // Contar total
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(checkouts);
    total = Number(countResult[0]?.count || 0);

  } else {
    // Buscar subscriptions com join de users e planos
    let query = db
      .select({
        id: subscriptions.id,
        userName: users.name,
        userEmail: users.email,
        planName: plans.name,
        planPrice: plans.price,
        startDate: subscriptions.startDate,
        endDate: subscriptions.endDate,
        status: subscriptions.status,
        externalId: subscriptions.externalId,
        createdAt: subscriptions.createdAt
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .leftJoin(plans, eq(subscriptions.planId, plans.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(limit)
      .offset(offset);

    // Aplicar filtros
    const conditions = [];
    if (statusFilter) {
      conditions.push(eq(subscriptions.status, statusFilter as any));
    }
    if (searchFilter) {
      conditions.push(
        or(
          like(users.name, `%${searchFilter}%`),
          like(users.email, `%${searchFilter}%`)
        )
      );
    }

    if (conditions.length > 0) {
      // @ts-ignore - drizzle typing issue
      query = query.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`);
    }

    subscriptionsList = await query;

    // Contar total
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(subscriptions);
    total = Number(countResult[0]?.count || 0);
  }

  const totalPages = Math.ceil(total / limit);

  const gatewaysList = gateways.map(g => ({
    ...g,
    isActive: !!g.isActive
  }));

  return c.html(
    <AdminFinance 
      gateways={gatewaysList} 
      activeGatewayName={activeGateway} 
      success={success}
      checkouts={checkoutsList}
      subscriptions={subscriptionsList}
      pagination={{ page, totalPages, total }}
      filters={{ status: statusFilter, search: searchFilter }}
    />
  );
});

adminRoutes.get('/settings', (c) => c.html(<AdminSettings />));

// SUPPORT ROUTES
adminRoutes.get('/support', async (c) => {
  let contacts = await db.select().from(supportContacts).orderBy(supportContacts.id);
  
  // Initialize default contacts if none exist
  if (contacts.length === 0) {
    await db.insert(supportContacts).values([
      { platform: 'whatsapp', url: 'https://wa.me/', isActive: true },
      { platform: 'telegram', url: 'https://t.me/', isActive: true }
    ]);
    contacts = await db.select().from(supportContacts).orderBy(supportContacts.id);
  }

  return c.html(<AdminSupport contacts={contacts} />);
});

adminRoutes.post('/support/update', async (c) => {
  const body = await c.req.parseBody();
  const contacts = await db.select().from(supportContacts);

  for (const contact of contacts) {
    const urlKey = `contacts[${contact.id}][url]`;
    const activeKey = `contacts[${contact.id}][isActive]`;
    
    let rawUrl = body[urlKey] as string;
    const isActive = body[activeKey] === 'true';
    
    // Ensure URL has correct prefix
    let finalUrl = rawUrl;
    if (contact.platform === 'whatsapp') {
      // Remove potential prefix user might have pasted
      rawUrl = rawUrl.replace('https://wa.me/', '').replace('wa.me/', '');
      finalUrl = `https://wa.me/${rawUrl}`;
    } else if (contact.platform === 'telegram') {
      rawUrl = rawUrl.replace('https://t.me/', '').replace('t.me/', '').replace('@', '');
      finalUrl = `https://t.me/${rawUrl}`;
    }

    await db.update(supportContacts)
      .set({ url: finalUrl, isActive })
      .where(eq(supportContacts.id, contact.id));
  }

  return c.redirect('/admin/support');
});

adminRoutes.get('/clients', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = (page - 1) * limit;
  const search = c.req.query('search') || '';

  // 1. Stats
  const [statsResult] = await db.select({
    total: sql<number>`count(*)`,
    active: sql<number>`count(*) filter (where ${users.subscriptionStatus} = 1)`,
    inactive: sql<number>`count(*) filter (where ${users.subscriptionStatus} = 0 or ${users.subscriptionStatus} is null)`
  }).from(users);

  const stats = {
    totalUsers: Number(statsResult?.total || 0),
    activeSubscribers: Number(statsResult?.active || 0),
    inactiveSubscribers: Number(statsResult?.inactive || 0)
  };

  // 2. Users with Latest Subscription End Date
  const latestSub = db.select({
    userId: subscriptions.userId,
    maxEndDate: sql<Date>`max(${subscriptions.endDate})`.as('max_end_date')
  }).from(subscriptions).groupBy(subscriptions.userId).as('latest_sub');

  let query = db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    subscriptionStatus: users.subscriptionStatus,
    lastSubscriptionEndDate: latestSub.maxEndDate
  })
  .from(users)
  .leftJoin(latestSub, eq(users.id, latestSub.userId));

  if (search) {
    query = query.where(
      or(
        like(users.name, `%${search}%`),
        like(users.email, `%${search}%`)
      )
    ) as any;
  }

  const usersList = await query
    .limit(limit)
    .offset(offset)
    .orderBy(desc(users.id));

  // 3. Total for Pagination
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(users);
  if (search) {
    countQuery = countQuery.where(
      or(
        like(users.name, `%${search}%`),
        like(users.email, `%${search}%`)
      )
    ) as any;
  }
  const [totalResult] = await countQuery;
  const total = Number(totalResult?.count || 0);
  const totalPages = Math.ceil(total / limit);

  return c.html(
    <AdminClients 
      users={usersList as any}
      stats={stats}
      pagination={{ page, totalPages, total }}
      filters={{ search }}
    />
  );
});

adminRoutes.get('/clients/:id/history', async (c) => {
  const userId = parseInt(c.req.param('id'));
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });

  if (!user) return c.html(<div class="p-8 text-center text-gray-500">Usuário não encontrado</div>);

  const [checkoutsHistory, subscriptionsHistory] = await Promise.all([
    db.select({
      id: checkouts.id,
      amount: checkouts.totalAmount,
      method: checkouts.paymentMethod,
      status: checkouts.status,
      date: checkouts.createdAt,
      type: sql<string>`'Checkout (JunglePay)'`
    })
    .from(checkouts)
    .where(eq(checkouts.userId, userId))
    .orderBy(desc(checkouts.createdAt)),

    db.select({
      id: subscriptions.id,
      amount: plans.price,
      method: sql<string>`'Assinatura'`,
      status: subscriptions.status,
      date: subscriptions.createdAt,
      type: sql<string>`'Subscription (Dias)'`
    })
    .from(subscriptions)
    .leftJoin(plans, eq(subscriptions.planId, plans.id))
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
  ]);

  const allTransactions = [...checkoutsHistory, ...subscriptionsHistory]
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  if (allTransactions.length === 0) {
    return c.html(
      <div class="p-12 text-center text-gray-500 flex flex-col items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="opacity-20"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        <p>Nenhuma transação encontrada para este usuário.</p>
      </div>
    );
  }

  return c.html(
    <div class="space-y-4 p-1">
      {allTransactions.map((tx) => (
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-all group">
          <div class="flex justify-between items-start mb-3">
            <div>
              <span class="text-[10px] font-black tracking-widest text-primary/60 uppercase">{tx.type}</span>
              <h5 class="text-white font-bold text-sm">Transação #{tx.id}</h5>
            </div>
            <span class={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
              tx.status === 'paid' || tx.status === 'active' 
                ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                : tx.status === 'pending'
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {tx.status}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Valor</p>
              <p class="text-white font-mono text-sm">
                {((tx.amount || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Método</p>
              <p class="text-white text-sm capitalize">{tx.method || '-'}</p>
            </div>
            <div class="col-span-2 pt-2 border-t border-white/5">
              <p class="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Data</p>
              <p class="text-gray-300 text-xs">
                {new Date(tx.date!).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// WHITELABEL ROUTES
// 1. Main View (Paginated via DB)
adminRoutes.get('/whitelabel', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  let models: any[] = [];
  let totalPages = 1;
  let error = undefined;
  let stats = { models: 0, posts: 0, media: 0 };
  
  try {
    const [result, fetchedStats] = await Promise.all([
        WhitelabelDbService.listModels(page, 12),
        WhitelabelDbService.getStats()
    ]);
    models = result.data;
    totalPages = result.totalPages;
    stats = fetchedStats;
  } catch (e: any) {
    error = e.message;
  }
  
  return c.html(
    <AdminWhitelabel 
      models={models} 
      currentPage={page}
      totalPages={totalPages}
      error={error} 
      stats={stats}
    />
  );
});

adminRoutes.post('/whitelabel/sync', async (c) => {
  try {
    const count = await WhitelabelDbService.syncModelsFromBucket();
    return c.json({ success: true, count });
  } catch (e: any) {
    console.error(e);
    return c.json({ success: false, error: e.message }, 500);
  }
});

export default adminRoutes;
