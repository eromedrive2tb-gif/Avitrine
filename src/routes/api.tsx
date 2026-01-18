import { Hono } from 'hono';
import { AdminService } from '../services/admin';
import { db } from '../db'; 
// Adicionado whitelabelMedia aos imports
import { whitelabelModels, whitelabelPosts, whitelabelMedia } from '../db/schema';
// Adicionado 'eq' aos imports
import { inArray, desc, sql, and, eq } from 'drizzle-orm';

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
    
    // PASSO 2: Buscar a imagem mais recente de cada modelo (CORRIGIDO E OTIMIZADO)
    // Usamos DISTINCT ON para garantir 1 resultado por modelo.
    // O filtro 'image' e a regex de extensão garantem que não venha mp3/m4v.
    const thumbnails = await db.selectDistinctOn([whitelabelPosts.whitelabelModelId], {
      modelId: whitelabelPosts.whitelabelModelId,
      url: whitelabelMedia.url,
      s3Key: whitelabelMedia.s3Key,
    })
    .from(whitelabelMedia)
    .innerJoin(whitelabelPosts, eq(whitelabelMedia.whitelabelPostId, whitelabelPosts.id))
    .where(
      and(
        inArray(whitelabelPosts.whitelabelModelId, modelIds),
        eq(whitelabelMedia.type, 'image'),
        // Filtro extra via Regex para garantir extensões de imagem (evita mp3 disfarçado)
        sql`${whitelabelMedia.s3Key} ~* '\\.(jpg|jpeg|png|webp|gif)$'`
      )
    )
    // Ordenamos pelo post mais novo (desc) e depois pela primeira mídia do post
    .orderBy(whitelabelPosts.whitelabelModelId, desc(whitelabelPosts.id), whitelabelMedia.id);

    // PASSO 3: Mesclar os dados
    const result = models.map(model => {
      // Se a modelo já tem thumbnail fixa no banco, usa ela
      if (model.thumbnailUrl) return model;

      // Busca a imagem encontrada no PASSO 2
      const thumb = thumbnails.find(t => t.modelId === model.id);
      let foundImage = thumb?.url || thumb?.s3Key;
      
      if (foundImage && typeof foundImage === 'string') {
        if (!foundImage.startsWith('http')) {
            foundImage = `https://bucketcoomerst.sfo3.cdn.digitaloceanspaces.com/${foundImage.split('/').map(p => encodeURIComponent(p)).join('/')}`;
        }
      }

      return {
        ...model,
        thumbnailUrl: foundImage || null
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

// Função auxiliar para garantir link da CDN
function formatCdn(path: string | null) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const safePath = path.split('/').map(p => encodeURIComponent(p)).join('/');
  return `https://bucketcoomerst.sfo3.cdn.digitaloceanspaces.com/${safePath}`;
}

apiRoutes.get('/models/:modelName/posts', async (c) => {
  const modelName = c.req.param('modelName');
  const page = parseInt(c.req.query('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const model = await db.select().from(whitelabelModels)
      .where(eq(whitelabelModels.folderName, modelName))
      .limit(1).then(res => res[0]);

    if (!model) return c.json({ error: '404' }, 404);

    const posts = await db.select().from(whitelabelPosts)
      .where(eq(whitelabelPosts.whitelabelModelId, model.id))
      .orderBy(desc(whitelabelPosts.id))
      .limit(limit)
      .offset(offset);

    // Formata as URLs dentro do JSON mediaCdns antes de enviar
    const formattedPosts = posts.map(post => {
      const media = typeof post.mediaCdns === 'string' ? JSON.parse(post.mediaCdns) : post.mediaCdns;
      return {
        ...post,
        mediaCdns: {
          images: (media?.images || []).map((img: string) => formatCdn(img)),
          videos: (media?.videos || []).map((vid: string) => formatCdn(vid))
        }
      };
    });

    return c.json({ data: formattedPosts, meta: { page, limit, count: formattedPosts.length } });
  } catch (err) {
    return c.json({ error: 'err' }, 500);
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