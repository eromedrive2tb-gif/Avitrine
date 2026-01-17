import { Hono } from 'hono';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminModels } from '../pages/admin/Models';
import { AdminAds } from '../pages/admin/Ads';
import { AdminPlans } from '../pages/admin/Plans';
import { AdminSettings } from '../pages/admin/Settings';
import { AdminWhitelabel } from '../pages/admin/Whitelabel';
import { WhitelabelService, type PaginatedResult } from '../services/s3';

const adminRoutes = new Hono();

adminRoutes.get('/', (c) => c.html(<AdminDashboard />));
adminRoutes.get('/models', (c) => c.html(<AdminModels />));
adminRoutes.get('/ads', (c) => c.html(<AdminAds />));
adminRoutes.get('/plans', (c) => c.html(<AdminPlans />));
adminRoutes.get('/settings', (c) => c.html(<AdminSettings />));

// WHITELABEL ROUTES
// 1. Main View (Paginated)
adminRoutes.get('/whitelabel', async (c) => {
  const token = c.req.query('token');
  let data: PaginatedResult = { 
    models: [], 
    nextToken: undefined, 
    isTruncated: false 
  };
  let error = undefined;
  
  try {
    data = await WhitelabelService.listModels(token, 12); 
  } catch (e: any) {
    error = e.message;
  }
  
  return c.html(<AdminWhitelabel models={data.models} nextToken={data.nextToken} error={error} />);
});

export default adminRoutes;
