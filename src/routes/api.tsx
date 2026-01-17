import { Hono } from 'hono';
import { AdminService } from '../services/admin';

const apiRoutes = new Hono();

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

apiRoutes.get('/admin/whitelabel/stats', async (c) => {
  try {
    const stats = await AdminService.getGlobalStats();
    return c.json(stats);
  } catch(e: any) {
    console.error("Stats Error:", e);
    return c.json({ totalModels: 'Erro', totalPosts: 0, error: e.message });
  }
});

// Auth API Mock
apiRoutes.post('/login', async (c) => {
  return c.redirect('/admin');
});

apiRoutes.post('/register', async (c) => {
    return c.redirect('/plans');
});

export default apiRoutes;
