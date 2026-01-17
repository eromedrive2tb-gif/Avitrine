import { Hono } from 'hono';
import { AdminService } from '../services/admin';
import { db } from '../db'; 
import { whitelabelModels, whitelabelPosts } from '../db/schema';
// Adicionado 'and' aos imports
import { inArray, desc, sql, and } from 'drizzle-orm';

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
    // PASSO 1: Buscar as modelos
    const models = await db.select({
      id: whitelabelModels.id,
      name: whitelabelModels.folderName,
      postCount: whitelabelModels.postCount,
      thumbnailUrl: whitelabelModels.thumbnailUrl,
    })
    .from(whitelabelModels)
    .orderBy(desc(whitelabelModels.postCount))
    .limit(limit)
    .offset(offset);

    if (models.length === 0) {
      return c.json({ data: [], meta: { page, limit, count: 0 } });
    }

    const modelIds = models.map(m => m.id);
    
    // PASSO 2: Buscar posts que POSSUAM imagens (CORRIGIDO)
    const posts = await db.selectDistinctOn([whitelabelPosts.whitelabelModelId], {
      modelId: whitelabelPosts.whitelabelModelId,
      mediaCdns: whitelabelPosts.mediaCdns
    })
    .from(whitelabelPosts)
    .where(
      and(
        inArray(whitelabelPosts.whitelabelModelId, modelIds),
        // Usando json_array_length em vez de jsonb_array_length
        sql`${whitelabelPosts.mediaCdns}->>'images' IS NOT NULL`,
        sql`json_array_length(${whitelabelPosts.mediaCdns}->'images') > 0`
      )
    )
    .orderBy(whitelabelPosts.whitelabelModelId, desc(whitelabelPosts.id));

    // PASSO 3: Mesclar os dados
    const result = models.map(model => {
      if (model.thumbnailUrl) return model;

      const post = posts.find(p => p.modelId === model.id);
      let foundImage = null;

      if (post && post.mediaCdns) {
        const media = typeof post.mediaCdns === 'string' 
          ? JSON.parse(post.mediaCdns) 
          : post.mediaCdns;
        
        if (media?.images && Array.isArray(media.images) && media.images.length > 0) {
          foundImage = media.images[0];
        }
      }
      
      if (foundImage && typeof foundImage === 'string') {
        // Se a imagem não for um link completo, ou se tiver espaços, 
        // garante que os caracteres especiais sejam URL-Safe
        if (!foundImage.startsWith('http')) {
            foundImage = `https://bucketcoomerst.sfo3.cdn.digitaloceanspaces.com/${foundImage.split('/').map(p => encodeURIComponent(p)).join('/')}`;
        }
      }

      return {
        ...model,
        thumbnailUrl: foundImage
      };
    });

    return c.json({
      data: result,
      meta: { page, limit, count: result.length }
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