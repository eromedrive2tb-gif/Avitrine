import { Hono } from 'hono';
import { AdminService } from '../services/admin';
import { WhitelabelDbService } from '../services/whitelabel';

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


apiRoutes.get('/models', async (c) => {
  const pageParam = c.req.query('page');
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  const limit = 20;

  try {
    const result = await WhitelabelDbService.getTopModelsWithThumbnails(page, limit);

    return c.json({
      data: result,
      meta: { page, limit, count: result.length }
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

// Auth API Mock
apiRoutes.post('/login', async (c) => {
  return c.redirect('/admin');
});

apiRoutes.post('/register', async (c) => {
    return c.redirect('/plans');
});

export default apiRoutes;
