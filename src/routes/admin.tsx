import { Hono } from 'hono';
import { db } from '../db';
import { plans, supportContacts, paymentGateways, checkouts, subscriptions, users } from '../db/schema';
import { eq, desc, like, or, sql } from 'drizzle-orm';
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

const adminRoutes = new Hono();

adminRoutes.get('/', (c) => c.html(<AdminDashboard />));
adminRoutes.get('/models', (c) => c.html(<AdminModels />));
adminRoutes.get('/ads', (c) => c.html(<AdminAds />));
adminRoutes.get('/ads/new', (c) => c.html(<AdminAdsCreate />));
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
  
  return c.html(<AdminPlans plans={allPlans} activeGateway={activeGateway} />);
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
