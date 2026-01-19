import { Hono } from 'hono';
import { db } from '../db';
import { plans } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminModels } from '../pages/admin/Models';
import { AdminAds } from '../pages/admin/Ads';
import { AdminPlans } from '../pages/admin/Plans';
import { AdminSettings } from '../pages/admin/Settings';
import { AdminWhitelabel } from '../pages/admin/Whitelabel';
import { WhitelabelDbService } from '../services/whitelabel';

const adminRoutes = new Hono();

adminRoutes.get('/', (c) => c.html(<AdminDashboard />));
adminRoutes.get('/models', (c) => c.html(<AdminModels />));
adminRoutes.get('/ads', (c) => c.html(<AdminAds />));
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
  return c.html(<AdminPlans plans={allPlans} />);
});
adminRoutes.get('/settings', (c) => c.html(<AdminSettings />));

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
