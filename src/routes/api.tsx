import { Hono } from 'hono';
import { AdminService } from '../services/admin';
import { db } from '../db'; 
import { whitelabelModels, whitelabelPosts } from '../db/schema';
import { inArray, desc, sql } from 'drizzle-orm';

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
  const offset = (page - 1) * limit;

  try {
    // PASSO 1: Buscar apenas as 20 modelos da página (Leve e Rápido)
    const models = await db.select({
      id: whitelabelModels.id,
      name: whitelabelModels.folderName,
      postCount: whitelabelModels.postCount,
      thumbnailUrl: whitelabelModels.thumbnailUrl, // Tenta pegar a oficial primeiro
    })
    .from(whitelabelModels)
    // .where(eq(whitelabelModels.status, 'active')) 
    .orderBy(desc(whitelabelModels.postCount))
    .limit(limit)
    .offset(offset);

    if (models.length === 0) {
      return c.json({ data: [], meta: { page, limit, count: 0 } });
    }

    // PASSO 2: Buscar 1 post recente para cada modelo encontrada (Batch Fetch)
    // Usamos 'DISTINCT ON' para garantir que venha apenas 1 post por modelo
    const modelIds = models.map(m => m.id);
    
    // Esta query busca o post mais recente de cada ID na lista, de forma super otimizada
    const posts = await db.selectDistinctOn([whitelabelPosts.whitelabelModelId], {
      modelId: whitelabelPosts.whitelabelModelId,
      mediaCdns: whitelabelPosts.mediaCdns
    })
    .from(whitelabelPosts)
    .where(inArray(whitelabelPosts.whitelabelModelId, modelIds))
    .orderBy(whitelabelPosts.whitelabelModelId, desc(whitelabelPosts.id));

    // PASSO 3: Mesclar os dados e extrair a imagem
    const result = models.map(model => {
      // Se já tiver thumbnail oficial, usa ela
      if (model.thumbnailUrl) return model;

      // Se não, procura no resultado da query de posts
      const post = posts.find(p => p.modelId === model.id);
      let foundImage = null;

      if (post && post.mediaCdns) {
        // Tratamento seguro do JSON no código (muito mais confiável que SQL)
        // O Drizzle costuma entregar o JSON já como objeto, mas garantimos aqui
        const media = typeof post.mediaCdns === 'string' 
          ? JSON.parse(post.mediaCdns) 
          : post.mediaCdns;
        
        // Pega a primeira imagem do array
        if (media?.images && Array.isArray(media.images) && media.images.length > 0) {
          foundImage = media.images[0];
        }
      }

      return {
        ...model,
        thumbnailUrl: foundImage // Preenche o null com a imagem encontrada
      };
    });

    return c.json({
      data: result,
      meta: {
        page,
        limit,
        count: result.length
      }
    });

  } catch (err: any) {
    console.error("Erro API Models:", err);
    return c.json({ error: 'Erro ao processar modelos.' }, 500);
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
