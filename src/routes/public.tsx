import { Hono } from 'hono';
import { db } from '../db';
import { whitelabelModels, whitelabelPosts } from '../db/schema';
import { desc, inArray, sql, and } from 'drizzle-orm'; // Adicionado 'sql' e 'and'
import { HomePage } from '../pages/Home';
import { ModelsPage } from '../pages/Models';
import { PlansPage } from '../pages/Plans';
import { AuthPage } from '../pages/Auth';
import { ModelProfilePage } from '../pages/ModelProfile';
import { PostDetailPage } from '../pages/PostDetail';

// Imports necessários para Assinar a URL
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_CONFIG } from '../services/s3';

const publicRoutes = new Hono();

// Função auxiliar para gerar URL assinada a partir da URL pública
async function signUrl(publicUrl: string | null) {
  if (!publicUrl) return null;
  try {
    const urlObj = new URL(publicUrl);
    let rawPath = urlObj.pathname.substring(1); 

    // CORREÇÃO: Trata URLs malformadas com '%%'
    if (rawPath.includes('%%')) {
        rawPath = rawPath.replace(/%%/g, '%25');
    }

    const key = decodeURIComponent(rawPath);

    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    });
    
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error(`Erro ao assinar URL ${publicUrl}:`, error);
    return publicUrl; 
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

    let resultModels = models;

    // 2. Buscar thumbnails nas posts (CORREÇÃO AQUI)
    if (models.length > 0) {
      const modelIds = models.map(m => m.id);
      
      // A query agora filtra: "Traga o post mais recente QUE TENHA IMAGENS"
      const posts = await db.selectDistinctOn([whitelabelPosts.whitelabelModelId], {
        modelId: whitelabelPosts.whitelabelModelId,
        mediaCdns: whitelabelPosts.mediaCdns
      })
      .from(whitelabelPosts)
      .where(and(
         inArray(whitelabelPosts.whitelabelModelId, modelIds),
         // Verifica se a primeira posição do array de imagens não é nula
         sql`${whitelabelPosts.mediaCdns}::json->'images'->0 IS NOT NULL`
      ))
      .orderBy(whitelabelPosts.whitelabelModelId, desc(whitelabelPosts.id));

      // 3. Mesclar dados
      resultModels = models.map(model => {
        let finalImage = model.thumbnailUrl;

        // Se não tem oficial, tenta achar no post recuperado
        if (!finalImage) {
          const post = posts.find(p => p.modelId === model.id);
          if (post && post.mediaCdns) {
            const media = typeof post.mediaCdns === 'string' 
              ? JSON.parse(post.mediaCdns) 
              : post.mediaCdns;
            
            if (media?.images?.length > 0) {
              finalImage = media.images[0];
            }
          }
        }

        return { ...model, thumbnailUrl: finalImage };
      });
    }

    // 4. Assinar todas as URLs encontradas
    const signedModels = await Promise.all(resultModels.map(async (m) => {
      const signedThumb = await signUrl(m.thumbnailUrl);
      return {
        ...m,
        thumbnailUrl: signedThumb
      };
    }));

    return c.html(<HomePage models={signedModels} />);

  } catch (e) {
    console.error("Erro na Home:", e);
    return c.html(<HomePage models={[]} />);
  }
});

// Outras rotas...
publicRoutes.get('/models', (c) => c.html(<ModelsPage />));
publicRoutes.get('/models/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.html(<ModelProfilePage slug={slug} />);
});
publicRoutes.get('/posts/:id', (c) => {
  const id = c.req.param('id');
  return c.html(<PostDetailPage id={id} />);
});
publicRoutes.get('/plans', (c) => c.html(<PlansPage />));
publicRoutes.get('/login', (c) => c.html(<AuthPage type="login" />));
publicRoutes.get('/register', (c) => c.html(<AuthPage type="register" />));

export default publicRoutes;