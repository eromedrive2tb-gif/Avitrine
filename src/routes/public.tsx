import { Hono } from 'hono';
import { db } from '../db';
import { whitelabelModels, whitelabelPosts, whitelabelMedia } from '../db/schema';
import { desc, inArray, sql, and, eq } from 'drizzle-orm'; 
import { HomePage } from '../pages/Home';
import { ModelsPage } from '../pages/Models';
import { PlansPage } from '../pages/Plans';
import { AuthPage } from '../pages/Auth';
import { ModelProfilePage } from '../pages/ModelProfile';
import { PostDetailPage } from '../pages/PostDetail';

// Imports para assinatura de URL
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_CONFIG } from '../services/s3';

const publicRoutes = new Hono();

/**
 * Função para assinar a chave do S3 e gerar uma URL temporária válida.
 * Isso resolve o erro 403 Forbidden.
 */
async function signS3Key(key: string | null) {
  if (!key) return null;
  try {
    let finalKey = key;
    
    // Se a chave vier como uma URL completa, extraímos apenas o caminho do arquivo
    if (key.startsWith('http')) {
      const url = new URL(key);
      finalKey = decodeURIComponent(url.pathname.substring(1));
    }

    // Correção para caracteres especiais (como emojis ou espaços)
    if (finalKey.includes('%%')) {
        finalKey = finalKey.replace(/%%/g, '%25');
    }

    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: finalKey,
    });
    
    // Gera a URL assinada válida por 1 hora (3600 segundos)
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error(`Erro ao assinar chave ${key}:`, error);
    return null;
  }
}

// ROTA HOME
publicRoutes.get('/', async (c) => {
  try {
    // 1. Buscar as top 20 modelos
    const models = await db.select({
      id: whitelabelModels.id,
      name: whitelabelModels.folderName,
      postCount: whitelabelModels.postCount,
      thumbnailUrl: whitelabelModels.thumbnailUrl,
    })
    .from(whitelabelModels)
    .orderBy(desc(whitelabelModels.postCount))
    .limit(20);

    if (models.length === 0) {
      return c.html(<HomePage models={[]} />);
    }

    const modelIds = models.map(m => m.id);
    
    // 2. BUSCA OTIMIZADA: Apenas imagens reais (Evita MP3/Vídeo)
    const thumbnails = await db.selectDistinctOn([whitelabelPosts.whitelabelModelId], {
      modelId: whitelabelPosts.whitelabelModelId,
      s3Key: whitelabelMedia.s3Key,
    })
    .from(whitelabelMedia)
    .innerJoin(whitelabelPosts, eq(whitelabelMedia.whitelabelPostId, whitelabelPosts.id))
    .where(
      and(
        inArray(whitelabelPosts.whitelabelModelId, modelIds),
        eq(whitelabelMedia.type, 'image'),
        sql`${whitelabelMedia.s3Key} ~* '\\.(jpg|jpeg|png|webp|gif)$'`
      )
    )
    .orderBy(whitelabelPosts.whitelabelModelId, desc(whitelabelPosts.id), whitelabelMedia.id);

    // 3. Mesclar dados e ASSINAR as URLs para evitar o 403 Forbidden
    const signedModels = await Promise.all(models.map(async (model) => {
      const thumbData = thumbnails.find(t => t.modelId === model.id);
      
      // Prioridade: Thumbnail definida na modelo > Imagem encontrada no Post
      const keyToSign = model.thumbnailUrl || thumbData?.s3Key || null;

      return {
        ...model,
        thumbnailUrl: await signS3Key(keyToSign)
      };
    }));

    return c.html(<HomePage models={signedModels} />);

  } catch (e) {
    console.error("Erro na Home:", e);
    return c.html(<HomePage models={[]} />);
  }
});

publicRoutes.get('/models/:slug', async (c) => {
  const slug = c.req.param('slug');

  // Busca a modelo
  const model = await db.select().from(whitelabelModels)
    .where(eq(whitelabelModels.folderName, slug))
    .limit(1).then(res => res[0]);

  if (!model) return c.notFound();

  // 1. Assina a thumbnail do perfil da modelo
  model.thumbnailUrl = await signS3Key(model.thumbnailUrl);

  // Busca os primeiros 20 posts
  const initialPosts = await db.select().from(whitelabelPosts)
    .where(eq(whitelabelPosts.whitelabelModelId, model.id))
    .orderBy(desc(whitelabelPosts.id))
    .limit(20);

  // 2. Assina as thumbnails dos posts iniciais
  const formattedPosts = await Promise.all(initialPosts.map(async (post) => {
    const media = typeof post.mediaCdns === 'string' ? JSON.parse(post.mediaCdns) : post.mediaCdns;
    
    // Pega a primeira imagem para ser a thumbnail do post
    const firstImage = media?.images?.[0] || null;

    return {
      ...post,
      // Usamos a função signS3Key para gerar o link temporário válido
      thumbnail: await signS3Key(firstImage)
    };
  }));

  return c.html(<ModelProfilePage model={model} initialPosts={formattedPosts} />);
});

// Outras rotas...
publicRoutes.get('/models', (c) => c.html(<ModelsPage />));
publicRoutes.get('/posts/:id', (c) => {
  const id = c.req.param('id');
  return c.html(<PostDetailPage id={id} />);
});
publicRoutes.get('/plans', (c) => c.html(<PlansPage />));
publicRoutes.get('/login', (c) => c.html(<AuthPage type="login" />));
publicRoutes.get('/register', (c) => c.html(<AuthPage type="register" />));

export default publicRoutes;