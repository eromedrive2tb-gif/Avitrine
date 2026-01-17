import { Hono } from 'hono';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminModels } from '../pages/admin/Models';
import { AdminAds } from '../pages/admin/Ads';
import { AdminPlans } from '../pages/admin/Plans';
import { AdminSettings } from '../pages/admin/Settings';
import { AdminWhitelabel } from '../pages/admin/Whitelabel';
import { WhitelabelService, type PaginatedResult } from '../services/s3';
import { WhitelabelDbService } from '../services/whitelabel';

const adminRoutes = new Hono();

adminRoutes.get('/', (c) => c.html(<AdminDashboard />));
adminRoutes.get('/models', (c) => c.html(<AdminModels />));
adminRoutes.get('/ads', (c) => c.html(<AdminAds />));
adminRoutes.get('/plans', (c) => c.html(<AdminPlans />));
adminRoutes.get('/settings', (c) => c.html(<AdminSettings />));

// WHITELABEL ROUTES
// 1. Main View (Paginated via DB)
adminRoutes.get('/whitelabel', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  let models: any[] = [];
  let totalPages = 1;
  let error = undefined;
  
  try {
    const result = await WhitelabelDbService.listModels(page, 12); 
    models = result.data;
    totalPages = result.totalPages;
  } catch (e: any) {
    error = e.message;
  }
  
  return c.html(
    <AdminWhitelabel 
      models={models} 
      currentPage={page}
      totalPages={totalPages}
      error={error} 
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
