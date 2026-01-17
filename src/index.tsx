import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { HomePage } from './pages/Home';
import { ModelsPage } from './pages/Models';
import { PlansPage } from './pages/Plans';
import { AuthPage } from './pages/Auth';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminModels } from './pages/admin/Models';
import { AdminAds } from './pages/admin/Ads';
import { AdminPlans, AdminSettings } from './pages/admin/Settings';
import { AdminWhitelabel } from './pages/admin/Whitelabel';
import { WhitelabelService } from './services/s3';
import { db } from './db';
import { models, posts } from './db/schema';
import { eq, sql } from 'drizzle-orm';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));

// Public Routes
app.get('/', (c) => c.html(<HomePage />));
app.get('/models', (c) => c.html(<ModelsPage />));
app.get('/plans', (c) => c.html(<PlansPage />));
app.get('/login', (c) => c.html(<AuthPage type="login" />));
app.get('/register', (c) => c.html(<AuthPage type="register" />));

// Admin Routes
app.get('/admin', (c) => c.html(<AdminDashboard />));
app.get('/admin/models', (c) => c.html(<AdminModels />));
app.get('/admin/ads', (c) => c.html(<AdminAds />));
app.get('/admin/plans', (c) => c.html(<AdminPlans />));
app.get('/admin/settings', (c) => c.html(<AdminSettings />));

// WHITELABEL ROUTES
// 1. Main View (Paginated)
app.get('/admin/whitelabel', async (c) => {
  const token = c.req.query('token');
  let data = { models: [], nextToken: undefined, isTruncated: false };
  let error = undefined;
  
  try {
    data = await WhitelabelService.listModels(token, 12); // 12 models per page
  } catch (e: any) {
    error = e.message;
  }
  
  return c.html(<AdminWhitelabel models={data.models} nextToken={data.nextToken} error={error} />);
});

// 2. API: Activate Models (Actual Implementation)
app.post('/api/admin/whitelabel/activate', async (c) => {
  const body = await c.req.parseBody();
  const activateAll = body['all'] === 'true';
  const specificModel = body['model'] as string;

  let foldersToProcess: string[] = [];

  if (activateAll) {
    foldersToProcess = await WhitelabelService.listAllModelFolders();
  } else if (specificModel) {
    foldersToProcess = [specificModel];
  }

  let processedCount = 0;
  let newModelsCount = 0;
  let newPostsCount = 0;

  try {
    for (const folder of foldersToProcess) {
       // Fetch full data from S3
       const s3Data = await WhitelabelService.getFullModelData(folder);
       
       // 1. Find or Create Model
       let modelId: number;
       const existingModel = await db.query.models.findFirst({
           where: eq(models.name, s3Data.folderName)
       });

       if (existingModel) {
           modelId = existingModel.id;
       } else {
           const [inserted] = await db.insert(models).values({
               name: s3Data.folderName,
               iconUrl: s3Data.thumbnailUrl,
               bannerUrl: s3Data.thumbnailUrl, // Use thumbnail as banner for now
               description: `Model imported from S3: ${s3Data.folderName}`,
               isFeatured: false,
               isAdvertiser: false
           }).returning();
           modelId = inserted.id;
           newModelsCount++;
       }

       // 2. Sync Posts
       for (const postData of s3Data.posts) {
           // Check duplicate by contentUrl
           const existingPost = await db.query.posts.findFirst({
               where: eq(posts.contentUrl, postData.contentUrl)
           });

           if (!existingPost) {
               await db.insert(posts).values({
                   modelId: modelId,
                   title: postData.id, // Using folder name as title
                   contentUrl: postData.contentUrl,
                   type: postData.type as 'image' | 'video'
               });
               newPostsCount++;
           }
       }
       processedCount++;
    }

    return c.html(
      <div id="toast" class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-xl animate-[fadeIn_0.5s]">
        ✅ Processado: {processedCount} modelos. (+{newModelsCount} novos, +{newPostsCount} posts)
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

// 3. API: Get Global Stats (Async load)
app.get('/api/admin/whitelabel/stats', async (c) => {
  try {
    // Parallel fetch: S3 Models & DB Posts
    const [s3Stats, dbStats] = await Promise.all([
        WhitelabelService.getGlobalStats(),
        db.select({ count: sql<number>`count(*)` }).from(posts)
    ]);

    return c.json({ 
        totalModels: s3Stats.totalModels,
        totalPosts: dbStats[0].count
    });
  } catch(e) {
    console.error(e);
    return c.json({ totalModels: 'Erro', totalPosts: 'Erro' });
  }
});

// Auth API Mock
app.post('/api/login', async (c) => {
  return c.redirect('/admin');
});
app.post('/api/register', async (c) => {
    return c.redirect('/plans');
});

export default app;